/* doTask Methods */
Meteor.methods({
	'insertTasks': function (newTaskTitle, newTaskDetail, formatedTime, user, startDate, dueDate, startTime, dueTime) {
		// Testing the type of data inputed in the text fields
		check(newTaskTitle, String);
		check(newTaskDetail, String);
		check(formatedTime, String);
		// User logged in
		var currentUserId = Meteor.userId();
		
		// Inserts the task title and the task detail in the database
		if(currentUserId) {
			Tasks.insert({
				taskTitle: newTaskTitle,
				taskDetail: newTaskDetail,
				createdBy: currentUserId,
				userFirtName: user,
				boxChecked: false,
				priority: "normal",
				time: formatedTime,
				startDate: startDate,
				startTime: startTime,
				endDate: dueDate,
				endTime: dueTime,
				share: false,
				selectiveSharing: false,
				numberOfSharings: 0
			});
			
		}
		
	},
	"removeTask": function(itemId) {
		check(itemId, String);
		var currentUserId = Meteor.userId();
		
		if(currentUserId) {
			Tasks.remove({_id: itemId, createdBy: currentUserId});
		}
	},
	"updateStartDate": function(taskId, selectedStartEndDateTime) {
		Tasks.update({_id: taskId}, {$set:{startDate: selectedStartEndDateTime}});     
	},
	"updateEndDate": function(taskId, selectedStartEndDateTime) {
		Tasks.update({_id: taskId}, {$set:{endDate: selectedStartEndDateTime}});
	},
	"updateStartTime": function(taskId, selectedStartEndDateTime) {
		Tasks.update({_id: taskId}, {$set:{startTime: selectedStartEndDateTime}});
	},
	"updateEndTime": function(taskId, selectedStartEndDateTime) {
		Tasks.update({_id: taskId}, {$set:{endTime: selectedStartEndDateTime}});
	},
	"updateTaskPriority": function(taskId, taskPriorityLevel) {
		if (taskPriorityLevel === "high") {
			Tasks.update({_id: taskId}, {$set: {priority: 'normal'}});
		}
		else if((taskPriorityLevel === "normal")){
			Tasks.update({_id: taskId}, {$set: {priority: 'high'}});
		}	
	},
	"updateCheckboxSatus": function(taskId) {
		var checkBoxValue = Tasks.findOne({_id: taskId}).boxChecked;
		if (checkBoxValue == false) {
			Tasks.update({_id: taskId}, {$set: {boxChecked: true}});
		}
		else {
			Tasks.update({_id: taskId}, {$set: {boxChecked: false}});
		}
	},
	"shareStatus": function(taskId, checkBoxValue) {
		// update the share status by getting the checkbox value
		Tasks.update({_id: taskId}, {$set: {share: checkBoxValue} })
	},
	"checkIfFriendExist": function(friendOriginalId) {
		var currentUserId = Meteor.userId();
		var friendAdded = Friends.findOne({originalFriendId: friendOriginalId});
		if (currentUserId) {
			if (friendAdded) {
				console.log("This user already exist!");
			}
			else {
				console.log("This user does not exist yet!");
			}
		}
	},
	"addFriend": function(friendUserId, firstName, lastName) {
		/* Creates a list of personal friends where to choose 
		   with whom to share content. This list is created after
		   the users system collection. The personal friends are
		   stored in the Friend collection
		*/
		   
		// Filtering parameters
		check(friendUserId, String);
		check(firstName, String);
		check(lastName, String);
		
		// current user
		var currentUserId = Meteor.userId();
		// Search if the user already exist
		var friendAdded = Friends.findOne({originalFriendId: friendUserId});
		
		// counts the number of elements in the collection for further use
		var numberOfElementsInCollection = Friends.find().count(); 
		
		if (currentUserId) { // check if user is logged in
				var i = 0;
				var searchForComparisonPurpose;
			    var searchCreatedByForComparisonPurpose;
			    
			    // Comparing values to prevent duplicates
				for (i; i<numberOfElementsInCollection; i++) {
					searchCreatedByForComparisonPurpose = Friends.find().fetch()[i].friendAddedBy;
					searchOriginalFriendIdForComparisonPurpose = Friends.find().fetch()[i].originalFriendId;
					// Must be a personal list and with no duplicates entries
					if (searchCreatedByForComparisonPurpose === currentUserId && searchOriginalFriendIdForComparisonPurpose === friendUserId) {
						// This friend is already added!;
						return;
					}
				} // END for loop to compare values
			
				// If the friend does not exist yet, the friend is inserted
				Friends.insert({
					friendAddedBy: currentUserId,    //this.userId,
					originalFriendId: friendUserId, // The user id in the users collection
					friendFirstName: firstName,
					frienLastName: lastName,
					taskIdToBeShared: "",
					shareWithThisUser: false
				});	
		  
		} // END if Meteor.userId() to check if user is logged in and make comparison;	
	},
	"removeFriendFromList": function(itemId) {
		// remove friends from the list of personal Friends.
		// to add them back the user must click on the user she/he want to add
		// in the "System users list".
		check(itemId, String);
		var currentUserId = Meteor.userId();
		
		if(currentUserId) {
			Friends.remove({_id: itemId, friendAddedBy: currentUserId});
		}
	},
	"updateShareWithThisUserToTrue": function(friendId, taskToShareId) { 
		var currentUser = Meteor.userId();
		var checkBoxValue = Friends.findOne({_id: friendId}).shareWithThisUser;
		var friendOwner = Friends.findOne({_id: friendId}).friendAddedBy;
		var selectiveSharingStatus = Tasks.findOne({_id: taskToShareId}).selectiveSharing;
		if(currentUser && friendOwner === currentUser) {
			Friends.update({_id: friendId, friendAddedBy: currentUser}, {$set: {taskIdToBeShared: taskToShareId, shareWithThisUser: true}});
			Tasks.update({_id: taskToShareId}, {$inc: {numberOfSharings: 1}});
			return Tasks.find({_id: taskToShareId});
		}
	 },
	 "updateShareWithThisUserToFalse": function(friendId, taskToShareId) {
		var currentUser = Meteor.userId();
		var checkBoxValue = Friends.findOne({_id: friendId}).shareWithThisUser;
		var friendOwner = Friends.findOne({_id: friendId}).friendAddedBy;
		var selectiveSharingStatus = Tasks.findOne({_id: taskToShareId}).selectiveSharing;
		console.log("THE STATUS = "+selectiveSharingStatus);
		if(currentUser && friendOwner === currentUser) {
			Friends.update({_id: friendId, friendAddedBy: currentUser}, {$set: {taskIdToBeShared: "", shareWithThisUser: false}});
			Tasks.update({_id: taskToShareId}, {$inc: {numberOfSharings: -1}});
		}   
	},
	"sharePrivatelyStatus": function(taskId, checkBoxValue) {
		// update the share status by getting the checkbox value
		Tasks.update({_id: taskId}, {$set: {selectiveSharing: checkBoxValue}});
	},
	"taskIdToShare": function(taskToshare) {
		//Friends.update();
	},
	'getCurrentTime': function (){
		return Date.parse(new Date());
  }
});

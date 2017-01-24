
var handle;
var count = 0;

Accounts.onLogin(function(){
    handle = [Meteor.subscribe('tasks'), 
              Meteor.subscribe('publicShares') 
             ];
});

Accounts.onLogout(function(){
	console.log("You logged out!");
    handle.stop()
    handle = null
});


/////////	
/////// ROUTING
////////////////
  Router.configure({
	 layoutTemplate: 'ApplicationLayout' 
  });
  
  Router.route('/', function () {
   this.render('navigation',{
		to:"navbar"
	});
	this.render('welcomePage',{
		to:"main"
	});
  });
  
  Router.route('/task_windows', function () {
	this.render('navigation',{
		to:"navbar"
	});
	
	this.render('taskWindow',{
		to:"main"
	});
  });
  
  Router.route('/task_title_list', function () {
	this.render('navigation',{
		to:"navbar"
	});
	
	this.render('getTasksForm',{
		to:"inputform"
	});
	
	this.render('taskTitleList',{
		to:"main"
	});
    
  });    

  
  Router.route('/task_help', function () {
	this.render('navigation',{
		to:"navbar"
	});
	
	this.render('helpPage',{
		to:"main"
	});
 
  });   

  
  Router.route('/detail/:_id',function(){
		this.render('navigation',{
			to:"navbar"
		});

		this.render('taskDetail',{
			to:"main",
			data:function(){
				console.log("This is a task detail window and id params is " + this.params._id);
				Session.set("detail_id", this.params._id);
				//The template will render with its data context, no helper needed
				return Tasks.findOne({_id:this.params._id});
			}
		});
	});

<<<<<<< HEAD
// END Router


Tracker.autorun(function(){
  if(Meteor.userId()){
    /* Modal login, as it does not close
	   after the login, and the transparent div also
       remain there, this is to solve the problem. */
    // Close de login modal
    //$("#modalLoginBox").hide();
    // Closing the modal in meteor way not with jQuery
    // solve the scroll problem (page not showing content that are beyond the page height);
	Modal.hide('login'); 
    // Remove the transparent div 
    //$(".modal-backdrop.in").removeClass('modal-backdrop');
    Router.go("/task_windows");
  }
  else {
	  // without this the event for modal link does not run
	  //$("#modalLoginBox").show();
	  Router.go("/");
  }
});



var timeinterval;
var newDateParsed;
Meteor.startup(function () {
	//var endtime =  Session.get("dueDate");  //'September 8 2016 14:50:30 UTC-0400';
	
	 
	timeinterval = Meteor.setInterval(function () {
		//Meteor.call("getCurrentTime", function (error, result) {
			//Session.set("time", result);
			//var t = getTimeRemaining(endTimeFormated);
			//Session.set("t", t);
			newDateParsed = Date.parse(new Date());
			//console.log(newDateParsed);
			Session.set("newdate", newDateParsed);
			
		})
	}, 1000);


//////
//// onRENDERED
///////////////
Template.getTasksForm.onRendered(function() {
	// datetimepicker in the form
	$('#startDate').datetimepicker({format: 'MMMM Do, YYYY'});
	
	$('#dueDate').datetimepicker({format: 'MMMM Do, YYYY'},{
		useCurrent: false //Important! See issue #1075
	});
	
	$('#startTime').datetimepicker({format: 'HH:mm'});
    $('#dueTime').datetimepicker({format: 'HH:mm'});
    
    // Linking Calendars
    $("#startDate").on("dp.change", function (e) {
		$('#dueDate').data("DateTimePicker").minDate(e.date);
	});
	
	$("#dueDate").on("dp.change", function (e) {
		$('#startDate').data("DateTimePicker").maxDate(e.date);
			
	});
	
	// Linking clocks  FOR STUDY!!!	
	var $startTime1 = $('#startTime');
	var $endTime1 = $('#dueTime');

	$startTime1.datetimepicker({
	  format: 'LT',
	  stepping: 15,
	  minDate: moment().startOf('day'),
	  maxDate: moment().endOf('day')
	});
	
	$endTime1.datetimepicker({
	  format: 'LT',
	  useCurrent: false,
	  stepping: 15,
	  minDate: moment().startOf('day'),
	  maxDate: moment().endOf('day')
	});

	$startTime1.on("dp.change", function(e) {
	  $endTime1.data("DateTimePicker").minDate(e.date);
	});

	$endTime1.on("dp.change", function(e) {
	  $startTime1.data("DateTimePicker").maxDate(e.date);
	});

	$endTime1.on("dp.show", function(e) {
	  if (!$endTime1.data("DateTimePicker").date()) {
		var defaultDate = $startTime1.data("DateTimePicker").date().add(1, 'hours');
		$endTime1.data("DateTimePicker").defaultDate(defaultDate);
	  }
	
	});
}); // End onRendered function

Template.dateAndTime_Starting_Ending.onRendered(function() {	
	// Clock with datetimepicker in the task windows
    this.$('.startTimeDatetimepicker').datetimepicker({format: 'HH:mm'});
    this.$('.dueTimeDatetimepicker').datetimepicker({format: 'HH:mm'});
    
    // Calendar with datetimepicker
	$('.startDatetimepicker').datetimepicker({format: 'MMMM Do, YYYY'});
	
	$('.dueDatetimepicker').datetimepicker({format: 'MMMM Do, YYYY'},{
		useCurrent: false //Important! See issue #1075
	});
	
	// "Linked Calendar" but for now it works only with the first task post
	// maybe because they have all the same class
	$(".startDatetimepicker").on("dp.change", function (e) {
		$('.dueDatetimepicker').data("DateTimePicker").minDate(e.date);
	});
	
	$(".dueDatetimepicker").on("dp.change", function (e) {
		$('.startDatetimepicker').data("DateTimePicker").maxDate(e.date);
	});
	
	// hide all divs to edit time and date and make shares
	// user must click o "Click to expand" to edit time and make sharings	
	$(".toggle-box").hide('fast'); 
});


=======
Router.route('/userlist', {
	name: 'navigation',
    name: 'usersTemplate',
    waitOn: function() {
        return Meteor.subscribe('userList');
    },
    data: function() {
        return Meteor.users.find({});       
    }
 });
 
 
Router.route('/personalfriends', {
	//name: 'navigation',
    name: 'personalFriends',
    waitOn: function() {
        return Meteor.subscribe('personalFriendList');
    },
    data: function() {
        return Friends.find({});       
    }
 });
>>>>>>> cccd052414cac0d80f09f32798f6c35ebb761e2a
	
/////////
//// HELPERS
/////////////////
Template.body.helpers({
	"ended": function () {
		console.log(Session.get("t").total <= 0);
		return Session.get("t").total <= 0
	}
})



Template.welcomePage.helpers({
	"userName": function() {
		var currentUser = Meteor.userId(); 
		var userFirstName = Meteor.users.findOne({_id: currentUser}).profile.firstName;
		Session.set("userFirstName", userFirstName);
		//console.log(userFirstName);
		return userFirstName;
	}
})

Template.getTasksForm.helpers({
	"actualUser": function() {
		var user = Session.get("userName");
		return user;
	}
})

var audio = new Audio('alarm.mp3');

Template.taskWindow.helpers({
	"displayTasks": function() {
		var tasks = Tasks.find({}, {sort: {priority: 1, time: 1 }});
		return tasks;
	},
	"isTaskOwner": function() {
		//This is compare ids 
		var whoCreatedThisTask = this.createdBy;
		var whoIsLookingThisTask = Meteor.user()._id;
		if (whoCreatedThisTask === whoIsLookingThisTask) {
			return true;
		}	
	},
	"userName": function() {
		var currentUser = Meteor.userId(); 
		var userFirstName = Meteor.users.findOne({_id: currentUser}).profile.firstName;
		return userFirstName;
	},
	"daysOrHours": function() {	
		taskId = this._id;
		var i = 0;
		var numberOfTasks = Tasks.find({createdBy: Meteor.userId()}).count();
		var dueDate = Tasks.findOne({_id: taskId}).endDate;
		var suitableDueDate = dueDate.replace(/(\d+)(st,|nd,|rd,|th,)/, "$1");
		var dueTime = Tasks.findOne({_id: taskId}).endTime;
		// to remove the am and pm                
		//var dueTimeNewFornat = dueTime.slice(0, 5); 
		var dateAndTime = suitableDueDate + " " + dueTime;
		newDateParsed = Session.get("newdate"); 
		var dueTaskTimeParsed = Date.parse(dateAndTime);
		var time = dueTaskTimeParsed - newDateParsed;
		var days = Math.floor( time/(1000*60*60*24) );
		var hours = ("0" + Math.floor( (time/(1000*60*60)) % 24 )).slice(-2);
		var minutes = Math.floor( (time/1000/60) % 60 );
		var seconds = Math.floor( (time/1000) % 60 );
		Session.set("days", days);
		//return days + " " + "Days";
		//if(days < 1) { return "Overdue!"; }
		
		if(days === 0) {
			if(hours === 1) {
				return "In" + " " +  hours + " " + "Hour";
			}
			else if(hours > 1){
				return "In" + " " + hours + " " + "Hours";	
			}
			else if(hours < 1) {
				if(minutes > 1) {
					return "In" + " " + minutes + " " + "Minutes";
				}
				else if(minutes === 1){
						return "In" + " " + minutes + " " + "Minute";
				}
				else if(minutes < 1) {
					if(seconds > 1) {
						return "In" + " " + seconds + " " + "Seconds";
					}
					else {
						audio.play();  // "Jazz - Ragtime Tune", Scott Jopin > http://www.stephaniequinn.com/samples.htm
						return "In" + " " + seconds + " " + "Second";
					}
				}
			} 
		} 
		else {
			if(days <= 1) {
				return "In" + " " + days + " " + "Day";
			}
			else{
				return "In" + " " + days + " " + "Days";	
			}
			
		}
		
	}
		
});


Template.dateAndTime_Starting_Ending.helpers({
	"priorityLevel": function() {
		// Just for the sake of styling with css, to add a class
		var taskId = this._id;
		var taskPriorityLevel = Tasks.findOne({_id: taskId}).priority;
		if (taskPriorityLevel == 'normal') {
			return "normal-priority";
		}
		else {
			return  "high-priority";
		} 
	 },
	 "priority": function() {
		// to switch the text to "High Priority" and "Normal Priority"
		var taskId = this._id;
		var taskPriorityLevel = Tasks.findOne({_id: taskId}).priority;
		if (taskPriorityLevel == 'normal') {
			return true
		}
		else {
			Session.get("priority");
			return  false;
		} 
	 },
	 "checkBoxTaskDone": function() {
		var taskId = this._id;
		var checkBoxValue = Tasks.findOne({_id: taskId}).boxChecked;
		if (checkBoxValue == true) {
			return "checked";
		}
		else {
			return "";
		}
	 },
	 "getUser": function(user_id) {
		var user= Meteor.users.findOne({_id: user_id});
		if (user) {
			Session.set("user", user.username);
			return user.username;
		}
		else {
			return "unknown";
		}
	},
	"shareStatus": function() { 
		var taskId = this._id;
		var status = Tasks.findOne({_id: taskId}).share;
		if (status === true) {
		   return "checked";
		}
	},
	"isOwner": function() {
		// This is to compare ids
		// Only who created this task can perform some actions
		// such as edit date and time and share the task
		var whoCreatedThisTask = this.createdBy;
		var whoIsLookingThisTask = Meteor.user()._id;
		if (whoCreatedThisTask === whoIsLookingThisTask) {
			Session.set("isOwner", true);
			return true;
		}	
	},
	"shareInPrivateStatus": function() { // VER O CODIGO
		var taskId = this._id;
		var status = Tasks.findOne({_id: taskId}).selectiveSharing;
		if (status === true) {
		   return "checked";
		}
		
	}
});


Template.taskTitleList.helpers({
	"titleList": function() {
		var tasks = Tasks.find({}, {sort: {priority: 1, time: 1 }});
		return tasks;
	},
	"checkBox": function() {
		var taskId = this._id;
		var checkBoxValue = Tasks.findOne({_id: taskId}).boxChecked; 
		if (checkBoxValue == true) {
			Session.set("checkbox_status", checkBoxValue);
			return "checked";
		}
		else {
			return "";
		}
	 }
});


Template.taskDetail.helpers({
	"isTaskDetailOwner": function() {
		// This is to compare ids and check if 
		// the tasks was created by the current user
		// Only who created the task can edit it
		var whoCreatedThisTask = this.createdBy;
		var whoIsLookingThisTask = Meteor.user()._id;
		if (whoCreatedThisTask === whoIsLookingThisTask) {
			return true;
		}	
	},
	"daysOrHours": function() {	
		taskId = this._id;
		var i = 0;
		var numberOfTasks = Tasks.find({createdBy: Meteor.userId()}).count();
		var dueDate = Tasks.findOne({_id: taskId}).endDate;
		var suitableDueDate = dueDate.replace(/(\d+)(st,|nd,|rd,|th,)/, "$1");
		var dueTime = Tasks.findOne({_id: taskId}).endTime;
		// to remove the am and pm                
		//var dueTimeNewFornat = dueTime.slice(0, 5); 
		var dateAndTime = suitableDueDate + " " + dueTime;
		newDateParsed = Session.get("newdate"); 
		var dueTaskTimeParsed = Date.parse(dateAndTime);
		var time = dueTaskTimeParsed - newDateParsed;
		var days = Math.floor( time/(1000*60*60*24) );
		var hours = ("0" + Math.floor( (time/(1000*60*60)) % 24 )).slice(-2);
		var minutes = Math.floor( (time/1000/60) % 60 );
		var seconds = Math.floor( (time/1000) % 60 );
		Session.set("days", days);
		//return days + " " + "Days";
		if(days === 0) {
			if(hours === 1) {
				return "In" + " " +  hours + " " + "Hour";
			}
			else if(hours > 1){
				return "In" + " " + hours + " " + "Hours";	
			}
			else if(hours < 1) {
				if(minutes > 1) {
					return "In" + " " + minutes + " " + "Minutes";
				}
				else if(minutes === 1){
						return "In" + " " + minutes + " " + "Minute";
				}
				else if(minutes < 1) {
					if(seconds > 1) {
						return "In" + " " + seconds + " " + "Seconds";
					}
					else {
						audio.play();  // "Jazz - Ragtime Tune", Scott Jopin > http://www.stephaniequinn.com/samples.htm
						return "In" + " " + seconds + " " + "Second";
					}
				}
			}
		} 
		else {
			if(days <= 1) {
				return "In" + " " + days + " " + "Day";
			}
			else{
				return "In" + " " + days + " " + "Days";	
			}
			
		}
	}
}); 


/////////
//// EVENTS
/////////////////
Template.navigation.events({
	"click .js-login": function() {
		var currentUser = Meteor.userId();
		console.log("You clicked on me man user "+currentUser);
		if(!currentUser) {
			//$("#modalLoginBox").modal('show');
			Modal.show('login');
		}
	}
});


Template.getTasksForm.events({
	"click .js-btn-add-task": function() {
		// toggle the input tasks text fields
		$("form").toggle('slow');
		$("#taskTitle").focus();
	},
	"dp.change #startDate": function(event, templ) {
			//var taskId = this._id;
			// get the value of the selected date
			var inputStartingDate = templ.$('.startDateInput').val();
			Session.set("startDate", inputStartingDate);
			//console.log(inputStartingDate);
			//Meteor.call("updateStartDate", taskId, inputStartingDate);
			
	},
	"dp.change #dueDate": function(event, templ) {
		//var taskId = this._id;
		// get the value of the selected date
		var inputEndingDate = templ.$('.endDateInput').val();
		Session.set("dueDate", inputEndingDate);
	},
	"dp.change #startTime": function(event, templ) {
		// get the value of the selected date
		var inputStartingTime = templ.$('.startTimeInput').val();
		//console.log(inputStartingTime);
		Session.set("startTime", inputStartingTime);
		//Meteor.call("updateStartTime", taskId, inputStartingTime);
	},
	"dp.change #dueTime": function(event, templ) {
		//var taskId = this._id;
		// get the value of the selected date
		var inputEndingTime = templ.$('.dueTimeInput').val();
		//console.log(inputEndingTime);
		Session.set("dueTime", inputEndingTime);
		//Meteor.call("updateEndTime", taskId, inputEndingTime);
	},
	"submit form": function(event) {
	   // prevents the form to refresh when submited the tasks
		event.preventDefault(); 

		// Getting the value entered in the task title and task details fields 
		var newTaskTitle = event.target.taskTitle.value;
		var newTaskDetail = event.target.taskDetail.value;
		
		// Get the user name
		var user = Meteor.user().profile;
		user[Object.keys(user)[0]];
		var name = user[Object.keys(user)[0]];
		Session.set("userName", name);
		var startDate = Session.get("startDate");
		var dueDate = Session.get("dueDate");
		var startTime = Session.get("startTime");
		var dueTime = Session.get("dueTime");
		console.log(startDate);
		console.log(dueDate);
		console.log(startTime);
		console.log(dueTime);
		
			
		if(newTaskTitle.length !== 0 && newTaskDetail.length !== 0) {
			// Inserts the task title and the task detail in the database
			Meteor.call('insertTasks', newTaskTitle,newTaskDetail,formatedTime,name,startDate,dueDate,startTime,dueTime);
		}
		else {
		
			/*////// MODAL confirm remove//*/ 
			var modalTitle = document.getElementById("modal-alert");
			var modalText = document.getElementById("modal-text-alert");
			modalTitle.innerHTML = "doTask inserting task data"
			modalText.innerHTML = "You have to fill out all fields!";
		
			$('#modalAlertWindow').modal('show');
			
			var confirm_ok = document.getElementById("ok_thanks");
			
			return false;
		}

		
		$("form").toggle('slow');
			$(".js-change-add-task-status").html("<span class='added-task'>New Task Added!</span>");
			setTimeout(function() {$(".js-change-add-task-status").html("<span>Add New Task " + name + "!</span>").show();}, 2000);
			
		// Reseting input text fields
		event.target.taskTitle.value = "";
		event.target.taskDetail.value = "";
	}
	 
});

Template.taskWindow.events({
	"click .js-button-delete": function(event) {
		console.log("You want to delete this post?");
		// To remove tasks
		// getting the id of the clicked task 
		var itemId = this._id;
		
		/*////// MODAL confirm remove//*/ 
		var modalTitle = document.getElementById("modal-header-delete");
		var modalText = document.getElementById("modal-text-delete");
		modalTitle.innerHTML = "Task manager - Delete task"
		modalText.innerHTML = "Are you sure you want to delete permanentely this task?";
		
		$('#modalDeletePost').modal('show');
		//Meteor.modal('modalDeleteConfirm');
		var confirm_cancel = document.getElementById("cancel_delete");
		var confirm_ok = document.getElementById("ok_delete");
		
		
		
		confirm_ok.onclick = function() {
			// add a hide effect and then remove the task
			$('#'+itemId).hide('slow', function() {
					Meteor.call('removeTask', itemId);
				});
				return false; 
		}
	}
	
});

/* Formating the date and time*/

var dateNow = new Date();
	// formating the date
	var yearMonthDay = dateNow.toLocaleDateString();
	var time = dateNow.toLocaleTimeString();
	var formatedTime = yearMonthDay + " at " + time;
	

Template.dateAndTime_Starting_Ending.events({
	"dp.change .startDatetimepicker": function(event, templ) {
			var taskId = this._id;
			// get the value of the selected date
			var inputStartingDate = templ.$('.startDateInput').val();
			
			Meteor.call("updateStartDate", taskId, inputStartingDate);
			
	},
	"dp.change .dueDatetimepicker": function(event, templ) {
		var taskId = this._id;
		// get the value of the selected date
		var inputEndingDate = templ.$('.endDateInput').val();
		
		Meteor.call("updateEndDate", taskId, inputEndingDate);
	},
	"dp.change .startTimeDatetimepicker": function(event, templ) {
		var taskId = this._id;
		// get the value of the selected date
		var inputStartingTime = templ.$('.startTimeInput').val();
		
		Meteor.call("updateStartTime", taskId, inputStartingTime);
	},
	"dp.change .dueTimeDatetimepicker": function(event, templ) {
		var taskId = this._id;
		// get the value of the selected date
		var inputEndingTime = templ.$('.dueTimeInput').val();
		 
		Meteor.call("updateEndTime", taskId, inputEndingTime);
	},
	"click .js-task-priority": function() {
		var taskId = this._id;
		var taskPriorityLevel = Tasks.findOne({_id: taskId}).priority;
		// This is to compare ids
		// Only the task owner can change the priority level
		var owner;
		var whoCreatedThisTask = this.createdBy;
		var whoIsLookingThisTask = Meteor.user()._id;
		if (whoCreatedThisTask === whoIsLookingThisTask) {
			owner = true;
		}	
		
		if(owner) {
			Meteor.call("updateTaskPriority", taskId, taskPriorityLevel); 
		} 
	},
	"click .js-checkbox-task-done": function() {
		// When the task is already done
		var taskId = this._id;
		Meteor.call("updateCheckboxSatus", taskId);	
	},
	"click .js-share": function(event) {
		// Public share of tasks
		var taskId = this._id;
		var shareCheckboxStatus = event.target.checked;
		Meteor.call("shareStatus", taskId, shareCheckboxStatus);
	},
	"click .js-select-friend-to-share": function() { 
		// Acts with the personal friend list. 
		// when clicked it stores the task _id value in 
		// Session.set("taskSelectedToBeShared", taskToShareId)
		// a modal window appear with the user personal friend list
		// where the user can select a friend to share with
		var taskToShareId = this._id;
		// Get the id of the current task to be shared
		Session.set("taskSelectedToBeShared", taskToShareId);
		// The list of friend with checkboxes to select   
		$('#modal-select-friend').modal('show');
	},
	"click .js-share-privately": function(event) {
		// Private sharig of tasks
		var taskId = this._id;
		var shareCheckboxStatus = event.target.checked;
		Meteor.call("sharePrivatelyStatus", taskId, shareCheckboxStatus);
	},
	"click .js-toggle-edit-date-time-and-share-task": function() {
		var taskId = this._id;
		Session.set("theIdOfThisTask", taskId);
		var divToggleId = '#mine' + taskId;
		var summaryId = '#summary' + taskId;
		// toggle the edit time and date and sharing pannel
		var isVisible = $(divToggleId).is(':visible');
		var isHidden = $(divToggleId).is(':hidden');
		if(isHidden) {
			$(summaryId).html("Click to collapse!"); 
		}
		else {
			$(summaryId).html("Click to expand!");
		}
		 
		$(divToggleId).toggle('slow');
	}
});

/* The task simple list */
Template.taskTitleList.events({
	"titleList": function() {
		var tasks = Tasks.find({});
		return tasks;
	},
	"click .checkbox": function() {
		var taskId = this._id;
		Meteor.call("updateCheckboxSatus", taskId);	
	},
	"click .glyphicon-remove": function(event) {
		// To remove tasks
		// getting the id of the clicked task 
		var itemId = this._id;
		
		/*////// MODAL confirm remove//*/ 
		var modalTitle = document.getElementById("modal-header-delete");
		var modalText = document.getElementById("modal-text-delete");
		modalTitle.innerHTML = "Task manager - Delete task"
		modalText.innerHTML = "Are you sure you want to delete permanentely this task?";
		
		$('#modalDeletePost').modal('show');
		//Meteor.modal('modalDeleteConfirm');
		var confirm_cancel = document.getElementById("cancel_delete");
		var confirm_ok = document.getElementById("ok_delete");
		
		
		confirm_ok.onclick = function() {
			// add a hide effect and then remove the task
			$('#'+itemId).hide('slow', function() {
					//Tasks.remove({_id: itemId});
					Meteor.call('removeTask', itemId);
				});
				return false; 
	  }
	}
});


Template.welcomePage.events({
	"click .js-start": function() {
		var currentUser = Meteor.userId();
		console.log("You clicked on me man user "+currentUser);
		if(!currentUser) {
			//$("#modalLoginBox").modal('show');
			Modal.show('login');
		}
		
	 }
});

/* Count down helper*/
function getTimeRemaining(endtime){
	  var t = Date.parse(endtime) - Date.parse(new Date());
	  var seconds = Math.floor( (t/1000) % 60 );
	  var minutes = Math.floor( (t/1000/60) % 60 );
	  var hours = Math.floor( (t/(1000*60*60)) % 24 );
	  var days = Math.floor( t/(1000*60*60*24) );
	  return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	  };
	  
	}

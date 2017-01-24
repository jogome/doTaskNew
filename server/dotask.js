/* doTask. Publishing tasks content */
Meteor.publish('tasks', function() {
	var currentUserId = this.userId;
	return Tasks.find({ createdBy: currentUserId}, {selectiveSharing: true}, {sort: [["priority", "asc"]]}); // The same as {sort: {priority: 1}}
});

/* Sharing content publicaly */
Meteor.publish('publicShares', function() {
	var currentUserId = this.userId;
	return Tasks.find({ share: true });
});

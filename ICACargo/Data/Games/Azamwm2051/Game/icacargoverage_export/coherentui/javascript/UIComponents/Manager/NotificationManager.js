var NotificationManager = new function()
{
	this.init = function()
	{
		
	}
	this.pushNotificationToPlayer = function(message,type)
	{
		switch(type)
		{
			case "success" :

				NotificationManager.sendNotification(message,type)

			break;

			case "error" :

				NotificationManager.sendNotification(message,type)

			break;

			default :

				NotificationManager.sendNotification(message,type)

			break;
		}
	}
	this.sendNotification = function(message,type)
	{
		var n = noty({
			text:message,
			type: type,
			dismissQueue: true,
			timeout: 4000,
			layout: 'bottomRight',
			theme: 'defaultTheme'
		});
	}
}
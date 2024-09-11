self.addEventListener("notificationclick", function (event) {
  const notification = event.notification;
  const action = event.action;

  if (action === "view") {
    clients.openWindow("/dashboard"); 
  }
  notification.close(); 
});

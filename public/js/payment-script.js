// document.addEventListener('DOMContentLoaded', function () {
//   // Get the payment status from the EJS template
//   var status = '<%= status %>';
//   // var status = 'success';

//   function sendMessageToFlutter(message) {
//     try {
//       FlutterChannel.postMessage(message);

//       if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
//         window.ReactNativeWebView.postMessage(message);
//         console.log('Message sent via ReactNativeWebView:', message);
//       } else if (window.postMessage) {
//         window.postMessage(message, '*');
//         console.log('Message sent via window.postMessage:', message);
//       } else {
//         console.log('No Flutter bridge available');
//       }
//     } catch (err) {
//       console.error('Error sending message to Flutter:', err);
//     }
//   }

//   var flutterMessage;
//   switch (status) {
//     case 'success':
//       flutterMessage = 'success';
//       break;
//     case 'failure':
//     case 'error':
//       flutterMessage = 'failure';
//       break;
//     default:
//       flutterMessage = 'unknown';
//       break;
//   }

//   sendMessageToFlutter(flutterMessage);

//   var buttons = document.querySelectorAll('.btn');
//   buttons.forEach(function (button) {
//     button.addEventListener('click', function () {
//       sendMessageToFlutter(flutterMessage);
//     });
//   });
// });

document.addEventListener('DOMContentLoaded', function () {
  function sendMeeageToFlutter() {
    console.log(status);
    if (window.FlutterChannel) {
      window.FlutterChannel.postMessage(
        status === 'success' ? 'success' : 'failure',
      );
    } else {
      console.log('FlutterChannel not available');
    }
  }

  var flutterLink = document.getElementById('flutter-back-link');
  var status = flutterLink.getAttribute('data-status');

  if (flutterLink) {
    sendMeeageToFlutter();

    // تعریف رفتار کلیک
    flutterLink.addEventListener('click', function (e) {
      e.preventDefault();
      sendMeeageToFlutter();
    });
  }
});

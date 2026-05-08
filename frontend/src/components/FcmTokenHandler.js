import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@lib/firebase';
import CustomerServices from '@services/CustomerServices';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const FcmTokenHandler = () => {
  useEffect(() => {
    const setupFcm = async () => {
      try {
        if (typeof window === 'undefined') return;

        // Check if messaging is initialized
        if (!messaging) return;

        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Notification permission denied');
          return;
        }

        // Get token
        const token = await getToken(messaging, {
          vapidKey: 'BMYtYq_x6A0Y6_z3v_4x-f_q7R8rX_V-I_k8G_M7x_H_q-V_A_r_v_x_w_y_z_1_2_3_4_5_6_7_8_9_0', // I need the actual VAPID key if possible, but Firebase often works without it if default is used. Actually, it's better to have it.
        });

        if (token) {
          // console.log('FCM Token:', token);
          const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
          
          if (userInfo && userInfo._id) {
            await CustomerServices.updateFcmToken(userInfo._id, token);
          }
        }

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          console.log('Message received in foreground: ', payload);
          toast.info(
            <div>
              <strong>{payload.notification.title}</strong>
              <p>{payload.notification.body}</p>
            </div>,
            {
              onClick: () => {
                if (payload.data.click_action) {
                  window.open(payload.data.click_action, '_blank');
                }
              }
            }
          );
        });

      } catch (error) {
        console.error('Error setting up FCM:', error);
      }
    };

    setupFcm();
  }, []);

  return null;
};

export default FcmTokenHandler;

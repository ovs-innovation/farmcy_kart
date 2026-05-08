import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import AdminServices from '@/services/AdminServices';
import Cookies from 'js-cookie';
import { notifySuccess } from '@/utils/toast';

const FcmTokenHandler = () => {
  useEffect(() => {
    const setupFcm = async () => {
      try {
        if (typeof window === 'undefined') return;
        if (!messaging) return;

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const token = await getToken(messaging);

        if (token) {
          const adminInfo = Cookies.get('adminInfo') ? JSON.parse(Cookies.get('adminInfo')) : null;
          if (adminInfo && adminInfo._id) {
            await AdminServices.updateFcmToken(adminInfo._id, token);
          }
        }

        onMessage(messaging, (payload) => {
          notifySuccess(`${payload.notification.title}: ${payload.notification.body}`);
        });

      } catch (error) {
        console.error('Error setting up FCM in Admin:', error);
      }
    };

    setupFcm();
  }, []);

  return null;
};

export default FcmTokenHandler;

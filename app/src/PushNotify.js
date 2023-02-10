
import Notify from 'simple-notify'
import 'simple-notify/dist/simple-notify.min.css'
export default function PushNotify(status,title,text,autotimeout) {
    new Notify({
        status: status,
        title: title,
        text: text,
        effect: 'fade',
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: autotimeout,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right top'
      })
}

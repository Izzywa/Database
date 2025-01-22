import Cookies from 'js-cookie';

export default function csrftoken() {
    const csrftoken = Cookies.get('csrftoken')
    return csrftoken
}
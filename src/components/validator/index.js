
const validator = {
    checkEmail: (rule, value, callback) => {
        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        setTimeout(() => {
            if (mailReg.test(value)) {
                return callback()
            } else {
                return callback(new Error('请输入正确的邮箱格式'))
            }
        }, 100)
    },
    checkMobile: (rule, value, callback) => {
        const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
        if (!value) {
            return callback(new Error('电话号码不能为空'))
        }
        setTimeout(() => {
            // Number.isInteger是es6验证数字是否为整数的方法,实际输入的数字总是识别成字符串
            // 所以在前面加了一个+实现隐式转换

            if (!Number.isInteger(+value)) {
                return callback(new Error('请输入数字值'))
            } else {
                if (phoneReg.test(value)) {
                    return callback()
                } else {
                    return callback(new Error('电话号码格式不正确'))
                }
            }
        }, 100)
    }
}

export default validator

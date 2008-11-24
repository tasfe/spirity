// vim: set et sw=4 ts=4 sts=4 fdm=marker ff=unix fenc=utf8
/**
 * gCheckPassword.js - 密码强度规则（仿 google）
 *
 * @author mingcheng@taobao.com
 * @date   2008-10-20
 * @link   http://www.gracecode.com/
 * @link   http://www.planabc.net/2008/05/11/password_strength_meter/
 * @link   http://www.taobao.com/home/js/pwdintensity.js
 */
function gCheckPassword(password) {
    var _score = 0; // 初始化积分

    /**
     * 密码长度
     *
     *  5 分: 小于等于 4 个字符
     * 10 分: 5 到 7 字符
     * 25 分: 大于等于 8 个字符
     */
    if (password.length < 5) {
        _score += 5;
    } else if (password.length > 4 && password.length < 8) {
        _score += 10;
    } else if (password.length > 7) {
        _score += 25;
    }

    /**
     * 字母
     *  0 分: 没有字母
     * 10 分: 全都是小（大）写字母
     * 20 分: 大小写混合字母
     */
    var _UpperCount      = password.replace(/[^A-Z]/g, '').length;
    var _LowerCount      = password.replace(/[^a-z]/g, '').length;
    var _LowerUpperCount =  _UpperCount + _LowerCount;
    if (_UpperCount || _LowerCount) {
        _score += 20; 
    } else if ((!_UpperCount && _LowerCount) || (!_LowerCount && _UpperCount)) { // 条件可以优化
        _score += 10; 
    }

    /**
     * 数字
     *
     *  0 分: 没有数字
     * 10 分: 1 个数字
     * 20 分: 大于等于 3 个数字
     */
    var _NumberCount = password.replace(/[^0-9]/g, '').length;
    if (_NumberCount == 1) {
        _score += 10;
    } else if (_NumberCount >= 3) {
        _score += 20;
    }

    /**
     * 符号
     *  0 分: 没有符号
     * 10 分: 1 个符号
     * 25 分: 大于 1 个符号
     */
    var _CharacterCount = password.replace(/[^!@#$%^&*?_~]/g, '').length;
    if (_CharacterCount == 1) {
        _score += 10;
    } else if (_CharacterCount > 1) {
        _score += 25;
    }


    /**
     * 奖励
     *
     * 2 分: 字母和数字
     * 3 分: 字母、数字和符号
     * 5 分: 大小写字母、数字和符号
     */
    if (_NumberCount && (_UpperCount || _LowerCount)) {
        _score += 2;
    }

    if (_NumberCount && (_UpperCount || _LowerCount) && _CharacterCount) {
        _score += 3;
    }

    if (_NumberCount && _LowerUpperCount && _CharacterCount) {
        _score += 5;
    }

    /**
     * 最后的评分标准
     *
     * >= 90: 非常安全
     * >= 80: 安全（Secure）
     * >= 70: 非常强
     * >= 60: 强（Strong）
     * >= 50: 一般（Average）
     * >= 25: 弱（Weak）
     * >= 0: 非常弱
     */
    return _score;
}

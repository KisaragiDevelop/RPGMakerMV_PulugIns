//=============================================================================
// dev_ShowMessageLineAtOnce.js
//=============================================================================

/*:
 * @plugindesc メッセージの表示を強制的に一括表示します
 * @author うさぎ
 *
 * @help このプラグインにはプラグインコマンドはありません。
 */

(function() {
    var _Game_Message_prototype_add = Game_Message.prototype.add;
    Game_Message.prototype.add = function(text) {
        text = '\\>' + text;
        _Game_Message_prototype_add.call(this, text);
    };
})();
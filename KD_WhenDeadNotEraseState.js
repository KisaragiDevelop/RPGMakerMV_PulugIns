//=============================================================================
// dev_WhenDeadNotEraseState.js
//=============================================================================

/*:
 * @plugindesc 戦闘不能時、解除しないステートを設定します
 * @author うさぎ
 *
 * @help このプラグインにはプラグインコマンドはありません。
 *
 * ステートの「メモ」欄に<WhenDeadNotEraseState>または<戦闘不能時解除されない>
 * と書いた場合、戦闘不能になった場合でもそのステートは解除されません。
 * 開発者向け：metaタグから取得していないのは謎です。
 * 
 * ただしステートID1：「戦闘不能」にこのタグを設定すると爆発すると思うよ。
 */

(function() {

    // 戦闘不能時解除されないステートID配列を作成する。
    var Game_System_prototype_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        this._whenDeadNotEraseStates = this.makeWhenDeadNotEraseStates();
        Game_System_prototype_initialize.call(this);
    };

    Game_System.prototype.makeWhenDeadNotEraseStates = function() {
        // DBのステートのメモ欄に該当のタグがあれば戦闘不能時解除されないステートとして設定する
        var notErase = $dataStates.filter(function(x){
            if(x === null) return false;
            if(x.note.match(/<WhenDeadNotEraseState>|<戦闘不能時解除されない>/) !== null){
                return true;
            }
            return false;
        })
        return notErase.map(x => x.id);
    };
 
    var Game_BattlerBase_prototype_die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        // 残るステートを設定
        var states = this._states;
        states = states.filter(function(item){
                    if(this.indexOf(item) !== -1){
                        return true;
                    }
                    return false;
                },$gameSystem._whenDeadNotEraseStates);

        // 残るステートターンを設定
        var stateTurns = {};
        for (var i = 0; i < states.length; i++){
            stateTurns[states[i]] = this._stateTurns[states[i]];
        }

        Game_BattlerBase_prototype_die.call(this);

        this._states = states;
        this._stateTurns = stateTurns;
    };

})();
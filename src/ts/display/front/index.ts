/**
 * Class: FrontPage
 * @classdesc - トップページ用のClass
 */
import {rxResize, rxScroll, rxBreakpoint, RxResize_Data, RxScroll_Data, RxBreakpoint_Data} from '../../events';



export class FrontPage{


	constructor(){
		this.init();
	}



	/**
	 * 初期化処理
	 */
	private init():void{

		// リサイズ イベントを受け取る
		rxResize.source.subscribe((data:RxResize_Data) => {
			console.log(data);
		});

		// スクロール イベントを受け取る
		rxScroll.source.subscribe((data:RxScroll_Data) => {
			console.log(data);
		});

		// メディアクエリ
		rxBreakpoint.source.subscribe((data:RxBreakpoint_Data) => {
			console.log(data);
		});
	}
}
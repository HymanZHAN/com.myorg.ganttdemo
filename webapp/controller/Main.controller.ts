import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import formatter from "../model/formatter";

/**
 * @namespace com.myorg.ganttdemo.controller
 */
export default class Main extends BaseController {
	private formatter = formatter;

	public sayHello(): void {
		MessageBox.show("Hello World!");
	}
}

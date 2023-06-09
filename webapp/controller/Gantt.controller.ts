import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import Format from "sap/gantt/misc/Format";
import MessageBox from "sap/m/MessageBox";

/**
 * @namespace com.myorg.ganttdemo.controller
 */
export default class Gantt extends Controller {
	onInit() {
		const oData = {
			root: {
				children: [],
			},
		};

		for (let i = 0; i < 10; i++) {
			const oLine = {
				id: "line" + i,
				shapes: [
					{
						id: "s" + i + "-1",
						title: "Shape " + (i + 1) + " - 1",
						startTime:
							i === 2 ? undefined : Format.abapTimestampToDate("20181101090000"),
						endTime: i === 2 ? undefined : Format.abapTimestampToDate("20181110090000"),
					},
				],
			};
			oLine.text = this.genLabel(i, oLine);
			oData.root.children.push(oLine);
		}
		const oModel = new JSONModel(oData);
		this.getView().setModel(oModel);

		setTimeout(() => {
			oData.root.children[0].shapes[0].startTime = undefined;
			oData.root.children[0].shapes[0].endTime = undefined;
			oData.root.children[0].text = this.genLabel(0, oData.root.children[0]);

			oData.root.children[1].shapes[0].startTime =
				Format.abapTimestampToDate("20181111090000");
			oData.root.children[1].shapes[0].endTime = Format.abapTimestampToDate("20181127090000");
			oData.root.children[1].text = this.genLabel(1, oData.root.children[1]);

			this.getView().getModel().setData(oData);
		}, 4000);
	}

	private genLabel(
		i: number,
		oLine: {
			id: string;
			shapes: { id: string; title: string; startTime: Date; endTime: Date }[];
		}
	): any {
		return `Row ${i + 1} [${this.formatDate(oLine.shapes[0].startTime)} - ${this.formatDate(
			oLine.shapes[0].endTime
		)}]`;
	}

	getRowById(sRowId: string) {
		const oModel: JSONModel = this.getView().getModel() as JSONModel;
		const aRows = oModel.getData().root.children;
		for (let i = 0; i < aRows.length; i++) {
			if (aRows[i].id === sRowId) {
				return aRows[i];
			}
		}
	}

	fnShapeDrop(oEvent: any) {
		const oDraggedShapeDates = oEvent.getParameter("draggedShapeDates"),
			oModel = this.getView().getModel() as JSONModel,
			sShapeId = oEvent.getParameter("lastDraggedShapeUid"),
			oShapeInfo = Utility.parseUid(sShapeId),
			sPath = oShapeInfo.shapeDataName,
			oNewDateTime = oEvent.getParameter("newDateTime"),
			oOldTimes = oDraggedShapeDates[sShapeId],
			iTimeDiff = oNewDateTime.getTime() - oOldTimes.time.getTime(),
			oTargetRow = oEvent.getParameter("targetRow"),
			oTargetShape = oEvent.getParameter("targetShape");
		oModel.setProperty(sPath + "/startTime", new Date(oOldTimes.time.getTime() + iTimeDiff));
		oModel.setProperty(sPath + "/endTime", new Date(oOldTimes.endTime.getTime() + iTimeDiff));
		if (oTargetRow || oTargetShape) {
			let oRow;
			if (oTargetRow) {
				if (oTargetRow.getBindingContext()) {
					oRow = oModel.getObject(oTargetRow.getBindingContext().getPath());
				} else {
					MessageBox.alert("Moving shapes to new rows is not supported by this sample.", {
						title: "Incorrect Operation",
					});
					return;
				}
			} else {
				oRow = oModel.getObject(oTargetShape.getParent().getBindingContext().getPath());
			}
			const oOriginalRow = this.getRowById(oShapeInfo.rowId);
			if (oOriginalRow.id !== oRow.id) {
				let iShapePos;
				for (iShapePos = 0; iShapePos < oOriginalRow.shapes.length; iShapePos++) {
					// TODO: Continue
				}
			}
		}
	}

	fnShapeResize(oEvent: any) {
		const oShape = oEvent.getParameter("shape"),
			aNewTimes = oEvent.getParameter("newTime");

		oShape.setTime(aNewTimes[0]);
		oShape.setEndTime(aNewTimes[1]);
	}

	private formatDate(oDate?: Date) {
		if (!oDate) {
			return "";
		}
		return `${oDate.getFullYear()}/${oDate.getUTCMonth()}/${oDate.getDate()}`;
	}
}

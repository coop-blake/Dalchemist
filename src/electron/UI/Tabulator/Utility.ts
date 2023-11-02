import { CellComponent, TabulatorFull as Tabulator } from "tabulator-tables";

export function styleFormatter(
  cell: CellComponent,
  formatterParams: { textColor: string; backgroundColor: string }
) {
  formatterParams.textColor
    ? (cell.getElement().style.color = formatterParams.textColor)
    : null;
  formatterParams.backgroundColor
    ? (cell.getElement().style.backgroundColor =
        formatterParams.backgroundColor)
    : null;
  return cell.getValue();
}

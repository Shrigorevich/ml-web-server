class Cell extends Konva.Rect {
    i;
    j;
    type = "";
    purpose = "";

    constructor(config, i, j, type, purpose) {
        super(config);
        this.i = i;
        this.j = j;
        this.type = type;
        this.purpose = purpose;
    }
}

export default Cell;
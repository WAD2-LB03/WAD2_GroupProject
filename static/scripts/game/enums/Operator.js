export default class Operator {
    static Add = new Operator("+");
    static Sub = new Operator("-");
    static Div = new Operator("/");
    static Mult = new Operator("*");
    static Mod = new Operator("%");

    constructor(name) {
        this.name = name;
    }
}
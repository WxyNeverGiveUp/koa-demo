import { runInContext } from "vm";
import { isObjectProperty } from "babel-types";

function sayHello(name: string): string{
    return "Hello, " + name;
}
let wuxy: string = 'wuxy';

console.log(sayHello(wuxy));

/* 数值 */

let num1: number = 6;
let notNum: number = NaN;

/* 字符串类型 */
let myName: string = "Tom";
let myAge: number = 26;

// 字符串模板
let sentence = `
    hello, this is my ${myName},
    我下个月 就 ${myAge + 1} 岁了。
`;

/* 空值void, 只能针对undefined与null*/
function alterName(): void{
    console.log('这个函数没有返回值');
}

/* 数组类型 */
let arr: [number,string] = [1,'2']; // 可枚举的元组
let arr2: any[] = [1,2,'3']; // => 表示任意类型的数组

/* 任意属性 */
let myFavoriteNumber: any = 'seven';
myFavoriteNumber = 7;

/* 类型推论 */
let newNumber: string = "six"; // 会默认为string
newNumber = "6";

/* 联合类型 */
let unionNumber: string | number | boolean; // 可以为字符串 数字 布尔值
unionNumber = 1;
unionNumber = "one";
unionNumber = true;

/* 访问联合类型的属性或方法 */
function getLength(something: number | string): number{
    if((<string>something).length){
        return (<string>something).length; // 类型断言
    }
    else{
        return something.toString().length;
    }
}

let newLength: number = getLength('something');

/* 接口对象 */
interface Person  {
    readonly id?: number;
    age?: number;
    name: string;
    [propName: string]: any; // 任意属性
}

// 注意，只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候
let tom: Person = {
    id: 17,
    name: 'tom',
    age: 25,    
    job: "doctor",
    address: "beijing",
}
// tom.id = 1;  // => error 因为id是只读属性或者常数
console.log(tom.name);

interface SquareConfig {
    width: number;
    color: string;
}


function createSquare(config: SquareConfig): {color: string; area: number}{
    let newSquare = {color: "white",area: 100};
    if(config.color){
        newSquare.color = config.color;
    }
    if(config.width){
        newSquare.area = config.width ** 2;
    }
    return newSquare;
}
let config: SquareConfig = {
    width: 20,
    color: "black",
}
console.log(createSquare(config))
console.log('h')

/* es6的class */
class Point{
    x: any;
    y: any;
    constructor(x: any,y: any){
        this.x = x;
        this.y = y;
    }
    toString(): string{
        return '(' + this.x + ',' + this.y + ')';
    }
}

/* es6表达式 */
const Myclass: any = class Me {
    getClassName(): string{
        return Me.name;
    }
}
let inst = new Myclass();
console.log(inst.getClassName());

/* this的指向 */
class Logger {
    printName(name: string): void{
        this.printName(`Hello ${name}`);
    }
    print(text: string): void{
        console.log(text);
    }
    get prop(){
        return "getter";  // 拦截该属性的存取行为
    }
    set prop(value: string){
        console.log('setter:' + value); // 拦截该属性的存取行为
    }
    static hello() {
        return 'Hello'; // 静态方法，直接通过类调用 Logger.hello()
    }
}

let logger = new Logger();
logger.prop = "12";

class Super{
    private helloWord: string = " 你好哦！！";
    x: string;
    y: string;
    constructor(x: string,y: string){
        this.x = x;
        this.y = y;
    }
    p(){
        return 2;
    }
    sayHello(helloword: string){
        this.helloWord = helloword;
        console.log(this.helloWord)
    }
    static run(){
        return 'hello';
    }
}
let father = new Super('xx','yy');
father.sayHello('你好！');

class Sub extends Super{
    color: string;
    constructor(x:string, y:string, color: string){
        super(x,y)
        this.color = color;
    }
    p(){
        return super.p() + 3;
    }
}

let cp = new Sub('w','u','y');
console.log(cp.p()); // => 5 父类中的2 + 子类中的3
console.log(cp) // 继承来自Super

/* 函数 */
function sum(x:number, y?: number):number{ // ?代表可选参数
    return x + y;
}
let myAdd: (baseValue: number, increment: number)  => number = function(x: number, y: number): number{
    return x + y;
}

/* 内置对象 */
// document.addEventListener('click', function(e: MouseEvent) {
//     console.log(e);
// });

/* 泛型 */
function identity<T>(arg: T): T {
    return arg;
}
let output = identity<string>("mystring");
console.log(output);

/* 元组 */
let xcatliu: [string, number];
xcatliu = ['Xcat Liu', 25];
xcatliu.push('http://xcatliu.com/');

console.log(xcatliu)
console.log(Object.prototype.toString.call(xcatliu).slice(8,-1))

/* 枚举类型 不要把计算项放在常数项前面*/
enum Days{Sun, Mon, Tue, Wed, Thu, Fri, Sat};
console.log(Days);
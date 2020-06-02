/**
 * Created by JetBrains WebStorm.
 * Author: yoon
 * Date: 20-6-2
 * Time: 下午2:30
 * Desc:
 */

// 1. interface
interface IBrid {
    name: string;
    eat(): void;
    fly(): void;
}

class Brid implements IBrid {
    name: string;

    eat(): void {
    }

    fly(): void {
    }

}

//2. 泛型

export interface ComResponse<D = any> {
    readonly recode: number;
    readonly message: string;
    readonly data: D;
    readonly success: boolean;
}

export interface PageInfo<M = any> {
    readonly models: M[],
    readonly first: boolean;
    readonly last: boolean;
    readonly number: number; // 第几页
    readonly numberOfElements: number; // 当前页数量
    readonly size: number; // 分页limit
    readonly totalElements: number; // 总数量
    readonly totalPages: number;
}

export interface ComPageResponse<M = any> extends ComResponse<PageInfo<M>> {

}


/****************************************** 使用方法示例 ***********************************************/
class User {
    id: 1;
    name: string;
}

const callback1 = (result: ComResponse<User>) => {
    console.log('callback()', result.data.id);
};
const callback2 = (result: ComPageResponse<User>) => {
    result.data.models.forEach(m => {
        console.log('callback()', m.id);
    });
};

// 3. 内置泛型
const user: Partial<User>;


// 4. 泛型约束

declare const JSEncrypt;
declare const CryptoJS;

interface IJSEncrypt {
    setPublicKey(pubKey: string): void;

    encrypt(str: string): string;
}

/**
 * 密码加密后的结果返回值
 */
export interface PasswordEncrypted<T> {
    encrypted: T;
    pubKey: string;
}

/**
 * 朔维密码加密
 * v1
 * 规则:
 * 1.提交前获取公钥
 * 2.将公钥与明文密码非对称加密后提交
 *
 * v2
 * 规则:
 * 1.提交前获取公钥
 * 2.将密码进行不可逆加密
 * 3.将公钥与密码经过MD5加密后的结果进行非对称加密后提交
 *
 * string[] 用于处理修改密码时旧密码与新密码都加密 且需要使用同一个pubKey的情景
 */
export function passwordEncrypt<T extends string | string[]>(password: T, version: 1 | 2 = 1, pubKey: string): PasswordEncrypted<T> {
    const jsEncrypt: IJSEncrypt = new JSEncrypt();
    let encrypted = null; // 非对称个加密后的密码

    jsEncrypt.setPublicKey(pubKey);
    // 重载处理
    if (typeof password === 'string') {
        if (version === 1) {
            encrypted = jsEncrypt.encrypt(password);
        } else {
            const encodePassword = CryptoJS.MD5(password).toString();
            encrypted = jsEncrypt.encrypt(encodePassword);
        }
    } else if (password instanceof Array) {
        if (version === 1) {
            encrypted = password.map(p => {
                return jsEncrypt.encrypt(p);
            });
        } else {
            encrypted = password.map(p => {
                const encodePassword = CryptoJS.MD5(p).toString();
                return jsEncrypt.encrypt(encodePassword);
            });
        }
    }
    return { encrypted, pubKey };
}

// 5. 联合类型&交叉类型

// 交叉类型
class C1 {
    name: string;
    call(): void {

    };
    fly(): void {

    }
}
interface C2 {
    sex: string;
    call(): void;
}

type Cross = C1 & C2;

const c: Cross = {} as Cross;
console.log(c.name, c.sex);

// 联合类型

type Union = C1 | C2;
const u: Union = {} as Union;

u.call();
// u.fly();
if (u instanceof C1) {
    u.fly();
}

// 6. namespace

namespace namespace_name1 {
    export namespace namespace_name2 {
        export class class_name {    }
    }
}

export namespace Runoob {
    export namespace invoiceApp {
        export class Invoice {
            public calculateDiscount(price: number) {
                return price * .40;
            }
        }
    }
}

// var Runoob;
// (function (Runoob) {
//     var invoiceApp;
//     (function (invoiceApp) {
//         var Invoice = /** @class */ (function () {
//             function Invoice() {
//             }
//             Invoice.prototype.calculateDiscount = function (price) {
//                 return price * .40;
//             };
//             return Invoice;
//         }());
//         invoiceApp.Invoice = Invoice;
//     })(invoiceApp = Runoob.invoiceApp || (Runoob.invoiceApp = {}));
// })(Runoob || (Runoob = {}));

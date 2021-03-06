//app.js 服务器端项目
//1:下载第三方模块 
//express/express-session/cors/mysql
//2:将第三方模块引入到当前程序中
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require('body-parser')
//3:创建数据库连接池
var pool = mysql.createPool({
	host: "127.0.0.1",
	// host: "103.45.98.117",
	user: "root",
	password: "",
	port: 3306,
	connectionLimit: 20,
	database: "xz"
})

//4:创建web服务器监听 8010 端口
var server = express();
//只要加入这个配置，在req请求对象上会多出来一个属性
//parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({
	extended: false
}))
//parse application/json
server.use(bodyParser.json())
server.listen(8010); //前端发送ajax请求的时候要填的端口号
//5:处理跨域 cors 
//5.1：配置允许访问程序地址(脚手架)
//     http://127.0.0.1:5050  (ok)
//     http://localhost:5050
//5.2:每请求是否验证true
server.use(cors({ //允许前端是以下接口访问
	origin: ["http://127.0.0.1:5010", "http://localhost:5010"],
	credentials: true
}))
//6:配置session
//#session配置一定要在所有请求之前
server.use(session({
	secret: "128位字符串", //#安全字符串
	resave: true, //#每次请求保存数据  
	saveUninitialized: true //#保存初始化数据
}));
//7:配置静态目录
//http://127.0.0.1:8080/01.jpg
server.use(express.static("public")); //路由中间件

//功能一:完成用户登录
//启动服务器app.js/启动数据库
//打开浏览器
//http://127.0.0.1:8080/login?uname=tom&upwd=123
//http://127.0.0.1:8080/login?uname=tom&upwd=122
server.post("/reg", (req, res) => {
	//6.1:接收网页传递数据 用户名和密码
	//获取url中的请求参数
	//在Express中没有内置获取表单post请求的api，
	//这里我们需要使用一个第三方包 body-parser
	let params = req.body
	let u = params.uname;
	let p = params.upwd;
	//6.2:创建sql
	let sql = `INSERT INTO xz_login (uname,upwd) VALUES (?,md5(?))`;
	//6.3:执行s++ql语句并且获取返回结果
	pool.query(sql,[u,p],(err, result) => {
		//6.4:判断是否成功
		if (err) throw err;
		// console.log(result.affectedRows)
		if(result.affectedRows==1){
			res.send({
				code: 1,
				msg: "注册成功"
			})
		}else{
			res.send({
				code: -1,
				msg: "注册失败"
			})
		}
	})
})
server.get("/login", (req, res) => {
	//6.1:接收网页传递数据 用户名和密码
	var u = req.query.uname;
	var p = req.query.upwd;

	//6.2:创建sql
	let sql = "SELECT id FROM xz_login";
	sql += " WHERE uname = ? AND upwd = md5(?)";
	//6.3:执行s++ql语句并且获取返回结果
	pool.query(sql, [u, p], (err, result) => {
		//6.4:判断登录是否成功
		if (err) throw err;
		//6.5:将结果返回网页
		if (result.length == 0) {
			res.send({
				code: -1,
				msg: "用户名或密码有误"
			})
		} else {
			//获取当前登录用户id
			//result=[{id:2}]
			// console.log("result[0]是" + result[0]);
			var id = result[0].id;
			//将用户id保存session对象中
			//uid当前登录：用户凭证
			req.session.uid = id;
			//  console.log(req.session);
			res.send({
				code: 1,
				msg: "登录成功"
			});
		}
	});
})

//功能二:商品分页显示77~109
//1:接收客户请求 /product GET
// http://103.45.98.117/product
// http://127.0.0.1:8080/product
// http://127.0.0.1:8080/product?pno=2
// http://127.0.0.1:8080/product?pno=3&pageSize=5
server.get("/product", (req, res) => {
	//2:接收客户请求数据 
	//  pno 页码   pageSize 页大小
	var pno = req.query.pno;
	var ps = req.query.pageSize;
	//3:如果客户没有请示数据设置默认数据
	//  pno=1     pageSize=4
	if (!pno) {
		pno = 1;
	}
	if (!ps) {
		ps = 4;
	}
	//4:创建sql语句
	var sql = "SELECT lid,lname,price,spec,img_url";
	sql += " FROM xz_laptop";
	sql += " LIMIT ?,?";
	var offset = (pno - 1) * ps; //起始记录数 ?
	ps = parseInt(ps); //行数       ?
	//5:发送sql语句
	pool.query(sql, [offset, ps], (err, result) => {
		//6:获取返回结果发送客户端
		if (err) throw err;

		res.send({
			code: 1,
			msg: "查询成功",
			data: result
		});
	});
})

//  购物车（登陆前提下）
//功能三:将指定商品添加至购物车
//#此功能先行条件先登录
//0:复制 db.sql中创建购物车表sql
//在mysql 执行
//1:接收客户端请求 /addcart GET
//http://127.0.0.1:8080/login?uname=tom&upwd=123
//http://127.0.0.1:8080/addcart?lid=1&lname=kk&price=9

server.get("/addcart", (req, res) => {
	//2:判断当前用户是否登录成功
	//  uid
	//  如果uid为undefined 没登录
	var uid = req.session.uid;
	if (!uid) {
		res.send({
			code: -1,
			msg: "请先登录"
		});
		return;
	}
	//3:获取客户端数据???小心处理
	//  lid    商品编号
	//  price  商品价格
	//  lname  商品名称
	var lid = req.query.lid;
	var price = req.query.price;
	var lname = req.query.lname;
	// console.log(lid+":"+price+":"+lname)
	//res.send(lid+":"+price+":"+lname);
	//4:创建查询sql:当前用户是否购买此商品
	var sql = "SELECT id FROM xz_cart";
	sql += " WHERE uid = ? AND lid = ?";
	//5:执行sql语句
	pool.query(sql, [uid, lid], (err, result) => {
		if (err) throw err;
		//6:在回调函数中判断下一步操作
		//  没购买过此商品  添加
		//  己购买过此商品  更新
		if (result.length == 0) {
			 var sql = `INSERT INTO xz_cart VALUES(null,${lid},'${lname}',${price},1,${uid})`;
			
		} else {
			var sql = `UPDATE xz_cart SET count=count+1 WHERE uid=${uid} AND lid=${lid}`;
		}
		//7:执行sql获取返回结果
		pool.query(sql,(err, result) => {
			if (err) throw err;
			//8:如果sql UPDATE INSERT DELETE
			//判断执行成功 result.affectedRows 影响行数
			if (result.affectedRows > 0) {
				res.send({
					code: 1,
					msg: "商品添加成功"
				});
			} else {
				res.send({
					code: -2,
					msg: "添加失败"
				});
			}
		})
	})
})

// 4.查询指定用户购物车信息
server.get("/carts", (req, res) => {
	// 登陆条件，是否有uid
	var uid = req.session.uid;
	if (!uid) {
		res.send({
			code: -1,
			msg: "请登录"
		});
		return;
	}
	// 创建sql语句
	var sql = "SELECT * FROM xz_cart WHERE uid=?";
	// 执行sql语句
	pool.query(sql, [uid], (err, result) => {
		if (err) throw err;
		res.send({
			code: 1,
			msg: "查询成功",
			data: result
		})
	})
})

// 5删除选中制定数据
server.get("/delItem", (req, res) => {
	// 1.获取个客户端数据
	// 判断是否登陆
	var uid = req.session.uid;
	if (!uid) {
		res.send({
			code: -2,
			msg: "请登录"
		});
		return;
	}
	var id = req.query.id;
	// 创建sql语句
	var sql = "DELETE FROM xz_cart WHERE id=?";
	// 执行sql语句
	pool.query(sql, [id], (err, result) => {
		// 获取结果判断是否删除成功
		if (err) throw err;
		if (result.affectedRows > 0) {
			res.send({
				code: 1,
				msg: "删除成功"
			});
		} else {
			res.send({
				code: -1,
				msg: "删除失败"
			});
		}
	})
})
//功能6.删除多个商品
server.get("/delItems", (req, res) => {
	//获取id
	var id = req.query.id;
	// 创建sql语句
	var sql = `DELETE FROM xz_cart WHERE id IN(${id})`; //IN是多个id
	// 执行sql语句
	pool.query(sql, (err, result) => {
		if (err) throw err;
		if (result.affectedRows > 0) { //结果，影响行数
			// 删除成功
			res.send({
				code: 1,
				msg: "删除成功"
			})
		} else {
			res.send({
				code: -1,
				msg: "删除失败"
			})
		}
	})
})

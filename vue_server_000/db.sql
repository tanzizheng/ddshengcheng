#db.sql 创建表添加数据
#学子商城 mintui版本

#功能一:创建表xz_login 用户登录表
USE xz;
CREATE TABLE xz_login(
  id INT PRIMARY KEY AUTO_INCREMENT,
  uname VARCHAR(50),
  upwd  VARCHAR(32)
);
#功能二:添加二条测试数据 
INSERT INTO xz_login VALUES(null,'tom',md5('123'));
INSERT INTO xz_login VALUES(null,'jerry',md5('123'));

USE xz;
###商品列表
#添加一列
ALTER TABLE xz_laptop ADD img_url VARCHAR(255);
#更新商品图片列表
UPDATE xz_laptop SET img_url='01.jpg'
WHERE lid =1;
#大于1改成02
UPDATE xz_laptop SET img_url='02.jpg'
WHERE lid >1;
#创建表 购物车
#DECIMAL 高精度浮点数 2.00-1.99=0.01
#INT     199分 /100  无误差
#lid 商品编号/price 价格/count数量
#lname 商品名称/uid用户编号
USE xz;
CREATE TABLE xz_cart(
  id     INT PRIMARY KEY AUTO_INCREMENT,
  lid    INT,
  price  DECIMAL(10,2),
  count  INT,
  lname  VARCHAR(255),
  uid    INT
);







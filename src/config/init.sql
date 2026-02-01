-- profile definition

CREATE TABLE IF NOT EXISTS "profile" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "fullname" varchar, "phoneNumber" varchar, "phoneCode" varchar NOT NULL, "gender" varchar, "dateOfBirth" varchar, "balance" double NOT NULL DEFAULT (0), "defaultAddress" varchar, "avatarUrl" varchar NOT NULL DEFAULT ('https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2025/04/cach-tao-avatar-discord.png'), "bio" text NOT NULL DEFAULT (''), "createdAt" text DEFAULT (datetime('now')), "updatedAt" text DEFAULT (datetime('now')));


-- "role" definition

CREATE TABLE IF NOT EXISTS "role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"));


-- address definition

CREATE TABLE IF NOT EXISTS "address" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "fullname" varchar NOT NULL, "phoneNumber" varchar NOT NULL, "countryCode" varchar NOT NULL, "address" varchar NOT NULL, "profileId" integer, CONSTRAINT "FK_d037a6704e2acea2438d9ab218b" FOREIGN KEY ("profileId") REFERENCES "profile" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION);


-- "user" definition

CREATE TABLE IF NOT EXISTS "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar, "isEmailVerified" boolean NOT NULL DEFAULT (0), "isDisabled" boolean NOT NULL DEFAULT (0), "accountNonExpired" boolean NOT NULL DEFAULT (1), "credentialsNonExpired" boolean NOT NULL DEFAULT (1), "accountNonLocked" boolean NOT NULL DEFAULT (1), "createdAt" text DEFAULT (datetime('now')), "updatedAt" text DEFAULT (datetime('now')), "profileId" integer, "roleId" integer, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION);

INSERT INTO "role" (name) VALUES
	 ('USER'),
	 ('MODERATOR'),
	 ('ADMIN');

INSERT INTO profile (fullname,phoneNumber,phoneCode,gender,dateOfBirth,balance,defaultAddress,avatarUrl,bio,createdAt,updatedAt) VALUES
	 ('Phan Sơn','0384195098','+84','MALE','1973-12-08',0,'60/122, Tổ 10, KP8, Đường Huỳnh Thị Hai, Phường Trung Mỹ Tây, Q.12, TP.HCM','https://i.pinimg.com/736x/4e/22/dd/4e22dde80c481b344bbe371fe1c2cf81.jpg','Hận đời vô đối','2025-11-25 03:23:23','2025-11-25 03:23:23'),
	 ('Trần Thị Hạnh','0329139871','+84','FEMALE','1978-08-04',0,'60/122, Tổ 10, KP8, Đường Huỳnh Thị Hai, Phường Trung Mỹ Tây, Q.12, TP.HCM','https://i.pinimg.com/736x/4e/22/dd/4e22dde80c481b344bbe371fe1c2cf81.jpg','Cuộc đời em như Shjt','2025-11-25 03:23:23','2025-11-25 03:23:23'),
	 ('Phan Tấn Tài','0338188506','+84','MALE','2001-25-05',999999,'60/122, Tổ 10, KP8, Đường Huỳnh Thị Hai, Phường Trung Mỹ Tây, Q.12, TP.HCM','https://i.pinimg.com/736x/4e/22/dd/4e22dde80c481b344bbe371fe1c2cf81.jpg','Hận Đời Chó Đẻ, Hận Kẻ Bạc Tình, Hận Luôn Gia Đình, Hận Ông Hàng Xóm','2025-11-25 03:23:23','2025-11-25 03:23:23');

INSERT INTO address (fullname,phoneNumber,countryCode,address,profileId) VALUES
	 ('Phan Sơn','0384195098','+84','52/367, Đường Bùi Quang Là, Quang Trung, Phường 12, Q.Gò Vấp, TP.HCM',1),
	 ('Phan Sơn','0384195098','+84','163/33, Đường Bùi Quang Là,  Phường Hạnh Thông Tây, Q.Gò Vấp, TP.HCM',1),
	 ('Trần Thị Hạnh','0329139871','+84','7 Đ. Phan Văn Hớn, Bà Điểm, Hóc Môn, Thành phố Hồ Chí Minh 07000',2),
	 ('Trần Thị Hạnh','0329139871','+84','Thôn Ao Dẻ 1, Xã Lạng Giang, Tỉnh Bắc Ninh, Việt Nam.',2),
	 ('Phan Tấn Tài','0338188506','+84','17 Lý Thường Kiệt . Hóc Môn. TP HCM ." Ngã Tư Hóc Môn." Chạy Vào Đường Lý Thường Kiệt 100m',3),
	 ('Phan Tấn Tài','0338188506','+84','58/4D ấp 4, , Xã Xuân Thới Thượng, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam',3);

INSERT INTO "user" (username,password,email,isEmailVerified,isDisabled,accountNonExpired,credentialsNonExpired,accountNonLocked,createdAt,updatedAt,profileId,roleId) VALUES
	 ('user01','$2b$10$vQ.h4j.q7eKvHDM79U7JReD/nKjCo4SleDnjW2clhNBahZrpeMuU2',NULL,0,0,1,1,1,'2025-11-25 03:20:31','2025-11-25 03:20:31',1,1),
	 ('user02','$2b$10$6Zt8IpprmXbMMhJCq/z49ur2x3D4yas7B88jW27Qz62HCn3o.jzzO',NULL,0,0,1,1,1,'2025-11-25 03:44:57','2025-11-25 03:44:57',2,1),
	 ('user03','$2b$10$TkL1d4p2adwMfVBA2w8g7ug5rmDk60Jhl1T28.3WYKaivESlgsG7y',NULL,0,0,1,1,1,'2025-11-25 03:49:14','2025-11-25 03:49:14',3,1);
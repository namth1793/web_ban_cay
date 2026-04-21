const imgs = {
  // Indoor plants
  monstera: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&h=500&fit=crop&auto=format',
  pothos: 'https://images.unsplash.com/photo-1622557850710-fde3b4a0a1a3?w=500&h=500&fit=crop&auto=format',
  sanseveria: 'https://images.unsplash.com/photo-1599598425947-5202edd56bdb?w=500&h=500&fit=crop&auto=format',
  spathiphyllum: 'https://images.unsplash.com/photo-1567753183720-5ba3f3aa86c6?w=500&h=500&fit=crop&auto=format',
  zz: 'https://images.unsplash.com/photo-1616434046297-33af6e7c4fbc?w=500&h=500&fit=crop&auto=format',
  dracaena: 'https://images.unsplash.com/photo-1591958939378-8c51c83c1f32?w=500&h=500&fit=crop&auto=format',
  // Flowers
  orchid: 'https://images.unsplash.com/photo-1566138163-be36ebe8c1f9?w=500&h=500&fit=crop&auto=format',
  rose: 'https://images.unsplash.com/photo-1490750967868-88df5691cc2b?w=500&h=500&fit=crop&auto=format',
  violet: 'https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=500&h=500&fit=crop&auto=format',
  lavender: 'https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=500&h=500&fit=crop&auto=format',
  // Bonsai
  bonsai1: 'https://images.unsplash.com/photo-1599598425947-5202edd56bdb?w=500&h=500&fit=crop&auto=format',
  bonsai2: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=500&h=500&fit=crop&auto=format',
  // Herbs
  herbs: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&h=500&fit=crop&auto=format',
  basil: 'https://images.unsplash.com/photo-1600689065810-77c7f571c9a6?w=500&h=500&fit=crop&auto=format',
  mint: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=500&h=500&fit=crop&auto=format',
  // Cactus
  cactus1: 'https://images.unsplash.com/photo-1530530488516-02af946f86fb?w=500&h=500&fit=crop&auto=format',
  cactus2: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&h=500&fit=crop&auto=format',
  succulent: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=500&h=500&fit=crop&auto=format',
  // Gift / general
  gift: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop&auto=format',
  garden: 'https://images.unsplash.com/photo-1416879595882-61a18a7b7abb?w=500&h=500&fit=crop&auto=format',
  tropical: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&auto=format',
};

export function seedData(db) {
  const count = db.prepare('SELECT COUNT(*) as c FROM categories').get().c;
  if (count > 0) return;

  const cat = db.prepare(`INSERT INTO categories (name,slug,description,image,sort_order) VALUES (?,?,?,?,?)`);
  cat.run('Cây Cảnh Trong Nhà', 'cay-canh-trong-nha', 'Các loại cây cảnh phù hợp để trong nhà, văn phòng, không cần nhiều ánh sáng', imgs.monstera, 1);
  cat.run('Cây Hoa & Cây Ra Hoa', 'cay-hoa-ra-hoa', 'Hoa lan, hoa hồng, hoa violet và các loại cây ra hoa đẹp', imgs.orchid, 2);
  cat.run('Xương Rồng & Sen Đá', 'xuong-rong-sen-da', 'Xương rồng, sen đá và các loại cây mọng nước dễ chăm sóc', imgs.cactus2, 3);
  cat.run('Cây Thảo Mộc & Rau Sạch', 'cay-thao-moc-rau-sach', 'Các loại rau thơm, thảo mộc trồng tại nhà, đảm bảo sạch và tươi', imgs.herbs, 4);
  cat.run('Cây Bonsai & Tiểu Cảnh', 'cay-bonsai-tieu-canh', 'Bonsai nghệ thuật, tiểu cảnh terrarium trang trí sang trọng', imgs.bonsai2, 5);
  cat.run('Quà Tặng Cây Mini', 'qua-tang-cay-mini', 'Combo cây mini đóng gói đẹp, thích hợp làm quà tặng mọi dịp', imgs.gift, 6);

  const p = db.prepare(`INSERT INTO products (category_id,name,slug,price,original_price,description,care_info,image,featured,sold) VALUES (?,?,?,?,?,?,?,?,?,?)`);

  const c_low = 'Tưới nước 2-3 lần/tuần. Đặt nơi có ánh sáng gián tiếp. Tránh ánh nắng trực tiếp.';
  const c_med = 'Tưới nước 1-2 lần/tuần. Cần ánh sáng tự nhiên 4-6 tiếng/ngày.';
  const c_cactus = 'Tưới nước 2 tuần/lần. Cần ánh nắng trực tiếp. Đất thoát nước tốt.';
  const c_herb = 'Tưới nước hàng ngày. Cần ánh nắng 6-8 tiếng/ngày. Bón phân hữu cơ 2 tuần/lần.';
  const c_bonsai = 'Tưới nước đều, giữ ẩm nhưng không ngập úng. Tỉa cành định kỳ. Cần ánh sáng tốt.';

  // === CAT 1: Cây cảnh trong nhà (8 sp) ===
  p.run(1,'Cây Monstera Deliciosa - Lá Rách','cay-monstera-deliciosa',280000,350000,
    'Monstera Deliciosa (cây lá rách) - biểu tượng của phong trào cây cảnh trong nhà. Lá to, xanh bóng với những lỗ tự nhiên độc đáo. Rất dễ chăm sóc và sinh trưởng nhanh.',
    c_low, imgs.monstera, 1, 312);
  p.run(1,'Cây Pothos - Trầu Bà Vàng','cay-pothos-trau-ba-vang',120000,150000,
    'Pothos (trầu bà vàng) - loài cây leo đơn giản nhất để trồng trong nhà. Lá xanh vàng óng ánh, buông rủ đẹp mắt. Chịu bóng tốt, phù hợp để bàn làm việc hoặc kệ cao.',
    c_low, imgs.pothos, 1, 445);
  p.run(1,'Cây Lưỡi Hổ - Sansevieria','cay-luoi-ho-sansevieria',199000,null,
    'Sansevieria (lưỡi hổ/cây rắn) - một trong những cây cảnh lọc không khí tốt nhất. Cực kỳ dễ sống, có thể chịu môi trường thiếu ánh sáng và ít nước.',
    'Tưới 2-3 tuần/lần. Chịu bóng rất tốt. Không cần chăm sóc nhiều.', imgs.sanseveria, 1, 389);
  p.run(1,'Cây Bạch Môn - Spathiphyllum','cay-bach-mon-spathiphyllum',250000,null,
    'Spathiphyllum (bạch môn/peace lily) - cây ra hoa trắng tinh khôi, lọc không khí hiệu quả. Thường ra hoa 2 lần/năm với bông hoa trắng thanh lịch.',
    c_low, imgs.spathiphyllum, 0, 178);
  p.run(1,'Cây ZZ Plant - Kim Tiền','cay-zz-plant-kim-tien',320000,380000,
    'ZZ Plant (kim tiền/zamioculcas) - cây cảnh chịu hạn và bóng tối cực kỳ tốt. Lá bóng xanh đậm, mọc thành từng tán đẹp mắt. Biểu tượng tài lộc theo phong thủy.',
    'Tưới 3-4 tuần/lần. Chịu bóng xuất sắc. Không cần ánh sáng trực tiếp.', imgs.zz, 1, 201);
  p.run(1,'Cây Dracaena - Cây Phú Quý','cay-dracaena-phu-quy',350000,420000,
    'Dracaena (cây phú quý) - loài cây trang trí phổ biến với lá dài xanh có viền vàng hoặc đỏ. Mang lại vẻ nhiệt đới cho không gian nội thất.',
    c_low, imgs.dracaena, 0, 134);
  p.run(1,'Cây Ficus Lyrata - Cây Đàn Cầm','cay-ficus-lyrata-dan-cam',450000,550000,
    'Ficus Lyrata (cây đàn cầm/fiddle leaf fig) - cây cảnh thời thượng được yêu thích nhất hiện nay. Lá to hình đàn violin, màu xanh đậm bóng loáng. Rất hợp với phong cách nội thất hiện đại.',
    'Tưới 1 lần/tuần. Cần ánh sáng gián tiếp tốt. Không thay đổi vị trí thường xuyên.', imgs.monstera, 1, 89);
  p.run(1,'Cây Thủy Sinh Mini Để Bàn','cay-thuy-sinh-mini-de-ban',180000,null,
    'Bộ cây thủy sinh mini trong bình thủy tinh trong suốt. Kết hợp cá thủy sinh nhỏ tạo nên hệ sinh thái thu nhỏ độc đáo. Trang trí bàn làm việc, kệ sách cực đẹp.',
    'Thay nước 1-2 tuần/lần. Đặt nơi có ánh sáng gián tiếp.', imgs.zz, 0, 223);

  // === CAT 2: Cây hoa & cây ra hoa (7 sp) ===
  p.run(2,'Hoa Lan Hồ Điệp Trắng','hoa-lan-ho-diep-trang',450000,550000,
    'Lan hồ điệp (Phalaenopsis) - nữ hoàng của các loài lan. Hoa trắng tinh khôi, bền đẹp 2-3 tháng. Thích hợp trang trí nhà, văn phòng hoặc làm quà tặng sang trọng.',
    'Tưới 1 lần/tuần bằng cách nhúng chậu vào nước 30 phút. Cần ánh sáng gián tiếp. Tránh gió lạnh.', imgs.orchid, 1, 267);
  p.run(2,'Hoa Lan Hồ Điệp Tím','hoa-lan-ho-diep-tim',480000,580000,
    'Lan hồ điệp tím đậm quyến rũ - giống lan đặc biệt với hoa tím ánh kim. Số lượng giới hạn, thích hợp làm quà biếu đặc biệt.',
    'Tưới 1 lần/tuần. Cần ánh sáng gián tiếp. Nhiệt độ 18-28°C.', imgs.violet, 1, 143);
  p.run(2,'Hoa Hồng Mini Chậu','hoa-hong-mini-chau',189000,230000,
    'Hoa hồng mini trồng trong chậu - những bông hoa nhỏ xinh nở liên tục quanh năm. Có nhiều màu sắc: đỏ, hồng, vàng, cam, trắng.',
    'Tưới hàng ngày. Cần nắng 6 tiếng/ngày. Bón phân hoa 2 tuần/lần.', imgs.rose, 1, 334);
  p.run(2,'Cây Violet Châu Phi','cay-violet-chau-phi',95000,null,
    'African Violet (violet châu Phi) - cây nhỏ bé nhưng ra hoa liên tục quanh năm. Hoa tím, hồng hoặc trắng mịn màng. Rất phù hợp để trên bàn làm việc.',
    'Tưới từ đáy chậu, không để nước dính lên lá. Cần ánh sáng gián tiếp.', imgs.violet, 0, 198);
  p.run(2,'Hoa Cẩm Tú Cầu Chậu','hoa-cam-tu-cau-chau',280000,320000,
    'Hydrangea (cẩm tú cầu) - những chùm hoa to bằng nắm tay, màu xanh tím quyến rũ. Biểu tượng của sự biết ơn và hiểu thấu. Quà tặng ý nghĩa.',
    'Tưới hàng ngày. Cần ánh sáng tốt. Đất luôn ẩm nhưng thoát nước tốt.', imgs.rose, 1, 112);
  p.run(2,'Cây Đại Lộc - Kalanchoe','cay-dai-loc-kalanchoe',120000,null,
    'Kalanchoe (đại lộc/cây trường thọ) - cây nhỏ ra hoa cụm màu đỏ, cam, vàng, hồng rực rỡ. Chịu hạn tốt, dễ chăm sóc, thường nở hoa vào dịp Tết.',
    'Tưới 1 lần/tuần. Cần nhiều nắng để ra hoa. Cắt hoa tàn để kích thích ra hoa mới.', imgs.rose, 0, 256);
  p.run(2,'Hoa Lavender Chậu','hoa-lavender-chau',160000,200000,
    'Lavender (oải hương) - cây hoa thảo mộc với mùi hương thư giãn nổi tiếng. Hoa tím xanh dịu dàng, vừa đẹp vừa thơm. Đuổi muỗi và côn trùng tự nhiên.',
    'Tưới 1-2 lần/tuần. Cần nắng đầy đủ. Đất thoát nước tốt.', imgs.lavender, 0, 167);

  // === CAT 3: Xương rồng & sen đá (7 sp) ===
  p.run(3,'Bộ 3 Chậu Xương Rồng Mini','bo-3-chau-xuong-rong-mini',89000,99000,
    'Bộ 3 chậu xương rồng mini xinh xắn trong chậu gốm trắng. Thích hợp làm quà tặng sinh nhật, kỷ niệm hay trang trí bàn làm việc.',
    c_cactus, imgs.cactus1, 1, 445);
  p.run(3,'Combo Sen Đá 5 Chậu Màu Sắc','combo-sen-da-5-chau-mau-sac',120000,150000,
    'Combo 5 chậu sen đá mini đa dạng màu sắc, được tuyển chọn kỹ lưỡng. Mỗi chậu một loại khác nhau tạo bộ sưu tập sinh động.',
    c_cactus, imgs.succulent, 1, 312);
  p.run(3,'Xương Rồng Cầu Vàng Để Bàn','xuong-rong-cau-vang-de-ban',150000,180000,
    'Echinocactus grusonii (cầu vàng) - hình dáng tròn hoàn hảo với gai vàng óng ánh. Biểu tượng may mắn theo phong thủy.',
    c_cactus, imgs.cactus1, 1, 234);
  p.run(3,'Cây Agave Blue Glauca','cay-agave-blue-glauca',180000,null,
    'Agave Blue Glauca lá dày màu xanh xám, mọc thành vòng tròn đẹp mắt. Chịu hạn cực tốt, phù hợp trang trí sân vườn hoặc ban công.',
    'Tưới 1 lần/tháng. Cần nắng trực tiếp. Đất cát thoát nước tốt.', imgs.cactus2, 0, 89);
  p.run(3,'Sen Đá Rosette Vòng Lớn','sen-da-rosette-vong-lon',95000,null,
    'Sen đá dạng vòng rosette lớn - hình dáng như bông hoa hồng bằng đá. Màu sắc đa dạng: xanh, tím, đỏ, xám. Rất phổ biến trong trang trí tiểu cảnh.',
    c_cactus, imgs.succulent, 0, 178);
  p.run(3,'Xương Rồng Cereus Trang Trí','xuong-rong-cereus-trang-tri',350000,null,
    'Xương rồng Cereus peruvianus cao 50-70cm, dùng để trang trí góc phòng, sảnh. Tạo điểm nhấn độc đáo cho không gian hiện đại.',
    c_cactus, imgs.cactus2, 1, 56);
  p.run(3,'Euphorbia Tam Giác Thần','euphorbia-tam-giac-than',189000,null,
    'Euphorbia trigona (cây tam giác thần) hình dáng 3 cạnh độc đáo, màu xanh đậm hoặc đỏ tím. Trang trí góc phòng, sân vườn hiện đại.',
    c_cactus, imgs.cactus1, 0, 123);

  // === CAT 4: Cây thảo mộc & rau sạch (6 sp) ===
  p.run(4,'Cây Rau Húng Quế Chậu','cay-rau-hung-que-chau',45000,null,
    'Húng quế (basil) tươi ngon trồng trong chậu. Hái lá dùng nấu ăn hàng ngày. Trồng ban công hay cửa sổ là có rau sạch ăn quanh năm.',
    c_herb, imgs.basil, 0, 567);
  p.run(4,'Cây Bạc Hà Thơm Chậu','cay-bac-ha-thom-chau',45000,null,
    'Bạc hà (mint) thơm mát trồng trong chậu. Dùng pha trà, làm cocktail, pha nước uống. Rất dễ trồng và phát triển nhanh.',
    c_herb, imgs.mint, 0, 489);
  p.run(4,'Bộ 3 Rau Thơm Chậu Mini','bo-3-rau-thom-chau-mini',120000,null,
    'Bộ 3 chậu rau thơm mini: húng quế + bạc hà + sả. Dễ trồng trên ban công, cửa sổ. Luôn có rau sạch tươi cho bếp nhà bạn.',
    c_herb, imgs.herbs, 1, 345);
  p.run(4,'Cây Lô Hội - Nha Đam Lớn','cay-lo-hoi-nha-dam-lon',150000,null,
    'Cây lô hội (nha đam/aloe vera) - vừa là cây cảnh đẹp vừa là dược liệu quý: chữa bỏng, dưỡng da, làm đẹp. Rất dễ trồng và ít cần chăm sóc.',
    'Tưới 2 tuần/lần. Cần nhiều nắng. Đất thoát nước tốt.', imgs.basil, 1, 412);
  p.run(4,'Cây Sả Chậu Lớn','cay-sa-chau-lon',89000,null,
    'Cây sả (lemongrass) trồng chậu - vừa làm gia vị nấu ăn vừa đuổi muỗi hiệu quả. Mùi thơm dịu nhẹ, rất phù hợp trồng ban công.',
    c_herb, imgs.herbs, 0, 234);
  p.run(4,'Cây Rau Mùi Tàu & Ngổ','cay-rau-mui-tau-ngo',55000,null,
    'Bộ đôi rau mùi tàu và rau ngổ trồng trong chậu. Rau sạch hữu cơ, hái dùng nấu phở, bún, canh hàng ngày.',
    c_herb, imgs.mint, 0, 189);

  // === CAT 5: Bonsai & tiểu cảnh (6 sp) ===
  p.run(5,'Cây Bồ Đề Bonsai Mini','cay-bo-de-bonsai-mini',550000,650000,
    'Bonsai bồ đề mini - loài cây linh thiêng được tạo dáng nghệ thuật. Lá nhỏ xanh mướt, thân uốn lượn tinh tế. Biểu tượng trí tuệ và bình an.',
    c_bonsai, imgs.bonsai2, 1, 67);
  p.run(5,'Cây Sanh Bonsai Phong Cách Nhật','cay-sanh-bonsai-nhat',780000,900000,
    'Bonsai cây sanh phong cách Nhật Bản - nghệ thuật trồng cây thu nhỏ tinh tế. Được tạo dáng công phu, phù hợp trang trí bàn giám đốc, phòng khách sang trọng.',
    c_bonsai, imgs.bonsai1, 1, 34);
  p.run(5,'Tiểu Cảnh Terrarium Thủy Tinh','tieu-canh-terrarium-thuy-tinh',350000,400000,
    'Terrarium trong bình thủy tinh hình cầu - hệ sinh thái thu nhỏ với rêu, đá, cây mini. Trang trí cực đẹp cho bàn làm việc hoặc làm quà tặng độc đáo.',
    'Phun sương nhẹ 1 lần/tuần. Đặt nơi có ánh sáng gián tiếp. Không mở nắp thường xuyên.', imgs.bonsai2, 1, 123);
  p.run(5,'Cây Cẩm Thị Bonsai','cay-cam-thi-bonsai',650000,750000,
    'Bonsai cây cẩm thị - loài cây bonsai ra quả nhỏ màu cam đỏ đẹp mắt. Rất được ưa chuộng vì vừa có giá trị nghệ thuật vừa ra quả.',
    c_bonsai, imgs.bonsai1, 0, 28);
  p.run(5,'Tiểu Cảnh Đá & Cây Mini','tieu-canh-da-cay-mini',290000,null,
    'Tiểu cảnh kết hợp đá tự nhiên, cây mini và các phụ kiện trang trí trong khay sứ. Phong cách thiền định Nhật Bản, mang lại cảm giác bình yên.',
    'Phun sương nhẹ 2-3 lần/tuần. Đặt nơi thoáng mát, ánh sáng vừa phải.', imgs.bonsai2, 0, 89);
  p.run(5,'Cây Kim Ngân Bonsai Để Bàn','cay-kim-ngan-bonsai-de-ban',420000,500000,
    'Bonsai kim ngân (jade plant) - cây mọng nước tạo dáng bonsai, lá xanh bóng tròn. Biểu tượng tài lộc và may mắn trong phong thủy.',
    'Tưới 2 tuần/lần. Cần ánh sáng vừa. Chịu hạn tốt, dễ chăm sóc.', imgs.bonsai1, 1, 156);

  // === CAT 6: Quà tặng cây mini (6 sp) ===
  p.run(6,'Combo Quà Tặng Cây Xanh 3 Chậu','combo-qua-tang-cay-xanh-3-chau',199000,250000,
    'Combo 3 chậu cây mini đa dạng loại: 1 cây lá + 1 cây hoa + 1 xương rồng. Đóng gói trong hộp quà xinh xắn kèm thiệp và hướng dẫn chăm sóc.',
    c_low, imgs.gift, 1, 345);
  p.run(6,'Giỏ Quà Cây Mọng Nước','gio-qua-cay-mong-nuoc',280000,350000,
    'Giỏ mây đan thủ công chứa 5-7 chậu cây mọng nước đa dạng. Đóng gói đẹp kèm ruy băng và thiệp. Quà tặng sang trọng cho sinh nhật, khai trương.',
    c_cactus, imgs.gift, 1, 178);
  p.run(6,'Hộp Quà Cây Văn Phòng Cao Cấp','hop-qua-cay-van-phong-cao-cap',450000,550000,
    'Hộp quà cao cấp gồm 1 cây to + 2 cây nhỏ + chậu gốm đẹp + phân bón + hướng dẫn chăm sóc. Phù hợp làm quà biếu sếp, đối tác, khách hàng VIP.',
    c_low, imgs.gift, 1, 89);
  p.run(6,'Chậu Cây Mini Với Chậu Gốm Thủ Công','chau-cay-mini-chau-gom-thu-cong',150000,null,
    'Cây mini được trồng trong chậu gốm thủ công sơn tay độc đáo, mỗi chiếc một hoa văn khác nhau. Quà tặng cá nhân hóa ý nghĩa.',
    c_low, imgs.gift, 0, 234);
  p.run(6,'Bộ Cây Mini Phong Thủy 5 Loại','bo-cay-mini-phong-thuy-5-loai',320000,380000,
    'Bộ 5 loại cây mini theo phong thủy: kim tiền, lưỡi hổ, trầu bà, sen đá, cây may mắn. Kèm đế gỗ và thẻ giải thích ý nghĩa phong thủy từng cây.',
    c_low, imgs.gift, 1, 156);
  p.run(6,'Cây Cọ Mini Trang Trí Bàn','cay-co-mini-trang-tri-ban',99000,null,
    'Cây cọ mini (parlor palm) tạo cảm giác nhiệt đới cho không gian làm việc. Chịu bóng tốt, không cần ánh sáng mạnh. Kích thước nhỏ gọn 15-20cm.',
    c_low, imgs.tropical, 0, 267);

  // === ARTICLES ===
  const a = db.prepare(`INSERT INTO articles (type,title,slug,summary,content,image) VALUES (?,?,?,?,?,?)`);

  a.run('cham-soc','Cách Chăm Sóc Cây Cảnh Trong Nhà Cho Người Mới Bắt Đầu','cach-cham-soc-cay-canh-trong-nha',
    'Hướng dẫn toàn diện về ánh sáng, nước, đất và phân bón cho các loại cây cảnh trong nhà phổ biến.',
    `<h2>1. Ánh Sáng - Yếu Tố Quan Trọng Nhất</h2><p>Mỗi loại cây có nhu cầu ánh sáng khác nhau. Cây lá xanh đậm (monstera, pothos, sansevieria) chịu bóng tốt, chỉ cần ánh sáng gián tiếp. Cây hoa và cây lá màu cần nhiều ánh sáng hơn để duy trì màu sắc và ra hoa.</p><h2>2. Tưới Nước Đúng Cách</h2><p>Nguyên tắc vàng: kiểm tra đất trước khi tưới. Đút ngón tay 3-4cm vào đất, nếu còn ẩm thì chưa cần tưới. Tưới thấm đến khi nước chảy ra đáy chậu, chờ đất khô mới tưới tiếp.</p><h2>3. Chọn Đất Phù Hợp</h2><p>Đa số cây trong nhà cần đất tơi xốp, thoát nước tốt. Trộn đất vườn + phân hữu cơ + trấu hun/perlite theo tỷ lệ 3:1:1 là hỗn hợp lý tưởng cho hầu hết các loại cây.</p><h2>4. Bón Phân</h2><p>Bón phân NPK loãng 1 lần/tháng trong mùa xuân-hè khi cây tăng trưởng mạnh. Giảm xuống 1 lần/2 tháng vào thu-đông. Không bón phân khi đất quá khô.</p>`,
    imgs.monstera);

  a.run('cham-soc','Bí Quyết Chăm Sóc Hoa Lan Tại Nhà Luôn Ra Hoa Đẹp','bi-quyet-cham-soc-hoa-lan-tai-nha',
    'Hướng dẫn chi tiết cách chăm sóc các loại lan phổ biến: lan hồ điệp, lan mokara, lan dendrobium để hoa nở lâu và ra hoa đều.',
    `<h2>Hiểu Về Nhu Cầu Của Lan</h2><p>Lan là loài cây đặc biệt, khác với cây thông thường. Hầu hết lan trong nhà (đặc biệt là lan hồ điệp) không trồng trong đất mà trong vỏ cây thông, dớn hoặc đất chuyên dụng để rễ có thể thở.</p><h2>Tưới Nước Đúng Cho Lan</h2><p>Phương pháp tốt nhất là nhúng toàn bộ chậu vào nước 15-20 phút mỗi tuần, sau đó để ráo hoàn toàn trước khi đặt trở lại. Không để nước đọng trong tâm cây.</p><h2>Ánh Sáng Cho Lan</h2><p>Lan hồ điệp cần ánh sáng gián tiếp, tránh nắng trực tiếp. Đặt gần cửa sổ hướng Đông là lý tưởng nhất - ánh sáng sáng sớm nhẹ nhàng.</p><h2>Kích Thích Ra Hoa</h2><p>Chênh lệch nhiệt độ ngày-đêm 5-10°C trong 4-6 tuần sẽ kích thích lan ra cành hoa mới. Đặt lan gần cửa sổ ban đêm vào mùa thu để đạt hiệu quả tốt nhất.</p>`,
    imgs.orchid);

  a.run('cham-soc','Trồng Rau Sạch Tại Nhà Trên Ban Công Đơn Giản','trong-rau-sach-tai-nha-tren-ban-cong',
    'Hướng dẫn từng bước trồng rau thơm, rau ăn lá ngay tại ban công nhỏ. Luôn có rau sạch hữu cơ cho gia đình.',
    `<h2>Chuẩn Bị Dụng Cụ</h2><p>Cần: chậu trồng có lỗ thoát nước (đường kính 20-30cm), đất trồng rau chuyên dụng, hạt giống hoặc cây giống, phân hữu cơ vi sinh. Không cần vốn lớn, có thể tận dụng thùng nhựa, hộp xốp.</p><h2>Các Loại Rau Dễ Trồng Nhất</h2><p>Người mới nên bắt đầu với: rau muống (30 ngày thu hoạch), cải xanh (25-30 ngày), húng quế (30-40 ngày), xà lách (35-45 ngày). Đây là những loại sinh trưởng nhanh, ít sâu bệnh.</p><h2>Kỹ Thuật Gieo Hạt</h2><p>Ngâm hạt 6-8 tiếng trong nước ấm trước khi gieo. Gieo hạt sâu 1-2cm, cách nhau 5-7cm. Tưới ẩm mỗi ngày. Hạt nảy mầm sau 3-7 ngày tùy loại.</p><h2>Chăm Sóc Hàng Ngày</h2><p>Tưới sáng sớm hoặc chiều mát. Bón phân hữu cơ 2 tuần/lần. Thu hoạch liên tục để kích thích ra chồi mới.</p>`,
    imgs.herbs);

  a.run('thong-tin','Top 10 Cây Cảnh Lọc Không Khí Tốt Nhất Cho Nhà Và Văn Phòng','top-10-cay-canh-loc-khong-khi',
    'NASA đã nghiên cứu và chứng minh những loài cây này có khả năng lọc các chất độc hại trong không khí hiệu quả nhất.',
    `<h2>Nghiên Cứu NASA Về Cây Lọc Không Khí</h2><p>Năm 1989, NASA đã thực hiện nghiên cứu nổi tiếng về khả năng lọc không khí của cây xanh. Kết quả cho thấy nhiều loài cây thông thường có thể loại bỏ formaldehyde, benzene và các chất độc hại khác trong không khí trong nhà.</p><h2>Top Cây Lọc Không Khí Hiệu Quả</h2><p><strong>1. Lưỡi hổ (Sansevieria)</strong>: Lọc formaldehyde, xylene, toluene, benzene. Cực kỳ dễ sống.</p><p><strong>2. Trầu bà/Pothos</strong>: Loại bỏ formaldehyde, xylene và benzene. Phát triển rất nhanh.</p><p><strong>3. Bạch môn (Peace Lily)</strong>: Lọc nhiều chất độc nhất, kể cả acetone và trichloroethylene.</p><p><strong>4. Dracaena</strong>: Rất hiệu quả với trichloroethylene và xylene.</p><p><strong>5. Cây nhện (Spider Plant)</strong>: An toàn với thú cưng và trẻ em, lọc CO và formaldehyde.</p>`,
    imgs.sanseveria);

  a.run('thong-tin','Ý Nghĩa Phong Thủy Của Các Loại Cây Cảnh Phổ Biến','y-nghia-phong-thuy-cay-canh-pho-bien',
    'Tìm hiểu ý nghĩa phong thủy của từng loại cây cảnh: cây nào mang tài lộc, cây nào xua đuổi tà khí, cây nào mang hạnh phúc.',
    `<h2>Cây Kim Tiền (ZZ Plant / Zamioculcas)</h2><p>Biểu tượng tài lộc số 1 trong phong thủy. Tên gọi đã nói lên tất cả - mang đến tiền bạc và của cải. Đặt tại góc tài lộc (góc phía Đông Nam của nhà) để tăng tài vận.</p><h2>Lưỡi Hổ (Sansevieria)</h2><p>Mang lại sức mạnh và bảo vệ. Gai nhọn của cây xua đuổi năng lượng tiêu cực. Đặt hai bên cổng hoặc cửa vào để bảo vệ gia đình.</p><h2>Trầu Bà (Pothos)</h2><p>Tượng trưng cho sự phát triển và thịnh vượng liên tục. Dây leo dài ra theo thời gian tượng trưng cho sự phát triển không ngừng của gia đình và sự nghiệp.</p><h2>Bạch Môn (Peace Lily)</h2><p>Mang lại hòa bình, bình yên cho gia đình. Hoa trắng tượng trưng cho sự trong sáng và may mắn. Đặt trong phòng ngủ giúp ngủ ngon hơn.</p>`,
    imgs.zz);

  a.run('thong-tin','Hướng Dẫn Chọn Cây Cảnh Phù Hợp Với Không Gian Sống','huong-dan-chon-cay-canh-phu-hop',
    'Cách chọn cây cảnh đúng theo diện tích, ánh sáng, phong cách nội thất và ngân sách để không gian sống thêm xanh mà không tốn công chăm sóc.',
    `<h2>Đánh Giá Điều Kiện Nhà Bạn</h2><p>Trước khi chọn cây, cần xác định: nhà hướng nào (ánh sáng nhiều hay ít?), diện tích đặt cây, phong cách nội thất (hiện đại, rustic, tropical, minimalist), và thời gian bạn có thể dành để chăm sóc.</p><h2>Nhà Ít Ánh Sáng</h2><p>Chọn: lưỡi hổ, ZZ plant, pothos, aglaonema, dracaena. Tránh: xương rồng, hoa hồng, lavender - những cây cần nhiều nắng.</p><h2>Người Bận Rộn</h2><p>Ưu tiên cây chịu hạn: ZZ plant, lưỡi hổ, xương rồng, sen đá, cây cao su. Đây là những cây có thể không tưới 2-3 tuần mà không chết.</p><h2>Muốn Cây Ra Hoa</h2><p>Lan hồ điệp, kalanchoe, violet châu Phi là những lựa chọn tốt cho nhà. Cần ánh sáng tốt hơn nhưng đổi lại bạn có hoa đẹp quanh năm.</p>`,
    imgs.garden);
}

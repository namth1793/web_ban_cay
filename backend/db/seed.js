const imgs = {
  cactus1: 'https://images.unsplash.com/photo-1530530488516-02af946f86fb?w=500&h=500&fit=crop&auto=format',
  cactus2: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&h=500&fit=crop&auto=format',
  succulent: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=500&h=500&fit=crop&auto=format',
  cactus3: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=500&h=500&fit=crop&auto=format',
  monstera: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&h=500&fit=crop&auto=format',
  pothos: 'https://images.unsplash.com/photo-1622557850710-fde3b4a0a1a3?w=500&h=500&fit=crop&auto=format',
  sanseveria: 'https://images.unsplash.com/photo-1599598425947-5202edd56bdb?w=500&h=500&fit=crop&auto=format',
  zz: 'https://images.unsplash.com/photo-1616434046297-33af6e7c4fbc?w=500&h=500&fit=crop&auto=format',
  orchid: 'https://images.unsplash.com/photo-1566138163-be36ebe8c1f9?w=500&h=500&fit=crop&auto=format',
  rose: 'https://images.unsplash.com/photo-1490750967868-88df5691cc2b?w=500&h=500&fit=crop&auto=format',
  lavender: 'https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=500&h=500&fit=crop&auto=format',
  bonsai: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=500&h=500&fit=crop&auto=format',
  herbs: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&h=500&fit=crop&auto=format',
  mint: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=500&h=500&fit=crop&auto=format',
  gift: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop&auto=format',
  agave: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&auto=format',
  aloe: 'https://images.unsplash.com/photo-1600689065810-77c7f571c9a6?w=500&h=500&fit=crop&auto=format',
  garden: 'https://images.unsplash.com/photo-1416879595882-61a18a7b7abb?w=500&h=500&fit=crop&auto=format',
};

export function seedData(db) {
  const count = db.prepare('SELECT COUNT(*) as c FROM categories').get();
  if (count.c > 0) return;

  const c_cactus = 'Tưới nước 2 tuần/lần. Cần ánh nắng trực tiếp. Đất thoát nước tốt.';
  const c_low = 'Tưới nước 2-3 lần/tuần. Đặt nơi có ánh sáng gián tiếp. Tránh ánh nắng trực tiếp.';

  // 3 categories
  const insertCat = db.prepare('INSERT INTO categories (name,slug,description,image,sort_order) VALUES (?,?,?,?,?)');
  insertCat.run('Xương Rồng Mini', 'xuong-rong-mini', 'Xương rồng, sen đá, cây mọng nước kích thước mini — để bàn làm việc, trang trí nội thất', imgs.cactus1, 1);
  insertCat.run('Xương Rồng Decor', 'xuong-rong-decor', 'Xương rồng và cây mọng nước kích thước lớn dùng trang trí không gian, phòng khách, sân vườn', imgs.cactus2, 2);
  insertCat.run('Các Loại Cây Khác', 'cay-khac', 'Cây cảnh trong nhà, cây hoa, thảo mộc, bonsai và quà tặng cây xanh', imgs.monstera, 3);

  const catRows = db.prepare('SELECT id, slug FROM categories ORDER BY sort_order').all();
  const catId = Object.fromEntries(catRows.map(r => [r.slug, r.id]));

  const ins = db.prepare('INSERT INTO products (category_id,name,slug,price,original_price,description,care_info,image,featured,sold) VALUES (?,?,?,?,?,?,?,?,?,?)');
  const p = (cslug, name, slug, price, orig, desc, care, img, featured, sold) =>
    ins.run(catId[cslug], name, slug, price, orig || null, desc, care, img, featured, sold);

  // --- Xương Rồng Mini ---
  p('xuong-rong-mini','Bộ 3 Chậu Xương Rồng Mini','bo-3-chau-xuong-rong-mini',89000,99000,'Bộ 3 chậu xương rồng mini xinh xắn trong chậu gốm trắng. Thích hợp trang trí bàn làm việc hoặc làm quà tặng sinh nhật.',c_cactus,imgs.cactus1,1,445);
  p('xuong-rong-mini','Combo Sen Đá 5 Chậu Màu Sắc','combo-sen-da-5-chau-mau-sac',120000,150000,'Combo 5 chậu sen đá mini đa dạng màu sắc, được tuyển chọn kỹ lưỡng. Mỗi chậu một loại khác nhau, xanh, tím, hồng, cam.',c_cactus,imgs.succulent,1,312);
  p('xuong-rong-mini','Xương Rồng Cầu Vàng Để Bàn','xuong-rong-cau-vang-de-ban',150000,180000,'Echinocactus grusonii (cầu vàng) — hình dáng tròn hoàn hảo với gai vàng óng ánh. Biểu tượng may mắn theo phong thủy.',c_cactus,imgs.cactus1,1,234);
  p('xuong-rong-mini','Sen Đá Rosette Vòng Lớn','sen-da-rosette-vong-lon',95000,null,'Sen đá dạng vòng rosette — hình dáng như bông hoa hồng bằng đá. Màu sắc đa dạng: xanh, tím, đỏ, xám.',c_cactus,imgs.succulent,0,178);
  p('xuong-rong-mini','Haworthia Zebra Mini','haworthia-zebra-mini',75000,null,'Haworthia fasciata — lá cứng có vạch trắng như da ngựa vằn. Chịu bóng tốt, rất dễ trồng trong nhà.','Tưới 2-3 tuần/lần. Chịu bóng tốt. Không cần ánh nắng trực tiếp.',imgs.cactus3,0,156);
  p('xuong-rong-mini','Lithops - Đá Sống Mini','lithops-da-song-mini',120000,null,'Lithops — còn gọi là "đá sống", cây mọng nước có hình dạng y hệt viên đá. Kỳ lạ và độc đáo, thích hợp làm quà tặng.','Tưới 1 lần/tháng. Cần nắng tốt. Đất cát thoát nước.',imgs.succulent,1,89);
  p('xuong-rong-mini','Combo Sen Đá Pastel 3 Chậu','combo-sen-da-pastel-3-chau',99000,120000,'Combo 3 chậu sen đá tone màu pastel nhẹ nhàng. Phù hợp trang trí bàn học, bàn làm việc theo phong cách Hàn Quốc.',c_cactus,imgs.succulent,1,267);
  p('xuong-rong-mini','Xương Rồng Bunny Ear Mini','xuong-rong-bunny-ear-mini',65000,null,'Opuntia microdasys — hình dáng như tai thỏ dễ thương. Bề mặt phủ lông trắng mịn, rất được yêu thích.','Tưới 2 tuần/lần. Cần nắng. Cẩn thận gai nhỏ.',imgs.cactus1,0,198);
  p('xuong-rong-mini','Crassula Jade Baby Mini','crassula-jade-baby-mini',90000,null,'Crassula ovata (cây ngọc bích) kích thước mini. Lá bóng xanh mọng, biểu tượng tài lộc và may mắn.','Tưới 2 tuần/lần. Cần ánh sáng. Đất thoát nước.',imgs.cactus3,0,134);
  p('xuong-rong-mini','Xương Rồng Star Cactus','xuong-rong-star-cactus',110000,130000,'Astrophytum asterias — hình ngôi sao độc đáo, đốm trắng trên thân xanh. Ra hoa vàng rực rỡ.',c_cactus,imgs.cactus2,1,112);
  p('xuong-rong-mini','Sen Đá Echeveria Mix 3 Chậu','sen-da-echeveria-mix-3-chau',85000,99000,'3 chậu sen đá Echeveria đa dạng: hình hoa hồng, màu sắc rực rỡ. Loại dễ nhân giống nhất.',c_cactus,imgs.succulent,0,223);
  p('xuong-rong-mini','Bộ 5 Sen Đá Đa Sắc','bo-5-sen-da-da-sac',145000,180000,'5 chậu sen đá màu sắc phong phú: xanh, tím, đỏ, vàng, hồng. Tặng kèm chậu sứ trắng nhỏ xinh.','Tưới 2 tuần/lần. Cần ánh sáng gián tiếp. Đất thoát nước.',imgs.succulent,1,189);
  p('xuong-rong-mini','Gasteria Mini Để Bàn','gasteria-mini-de-ban',70000,null,'Gasteria — họ hàng nhà lô hội, lá dày bóng xếp đối xứng đẹp mắt. Chịu bóng rất tốt.','Tưới 3 tuần/lần. Chịu bóng tốt. Dễ chăm sóc.',imgs.cactus3,0,145);
  p('xuong-rong-mini','Xương Rồng Feather Cactus Mini','xuong-rong-feather-mini',85000,null,'Mammillaria plumosa — phủ lông trắng mịn như lông vũ, trông cực kỳ dễ thương. Ra hoa nhỏ màu hồng.','Tưới 2 tuần/lần. Cần nắng tốt.',imgs.cactus1,0,167);

  // --- Xương Rồng Decor ---
  p('xuong-rong-decor','Xương Rồng Cereus Trang Trí 50-70cm','xuong-rong-cereus-trang-tri',350000,null,'Xương rồng Cereus peruvianus cao 50-70cm, trang trí góc phòng, sảnh. Tạo điểm nhấn độc đáo cho không gian hiện đại.',c_cactus,imgs.cactus2,1,56);
  p('xuong-rong-decor','Euphorbia Tam Giác Thần','euphorbia-tam-giac-than',189000,null,'Euphorbia trigona hình dáng 3 cạnh độc đáo, màu xanh đậm. Trang trí góc phòng, sân vườn hiện đại.',c_cactus,imgs.cactus2,1,123);
  p('xuong-rong-decor','Cây Agave Blue Glauca Decor','cay-agave-blue-glauca-decor',180000,null,'Agave Blue Glauca lá dày màu xanh xám, mọc thành vòng tròn đẹp mắt. Chịu hạn cực tốt, phù hợp sân vườn.','Tưới 1 lần/tháng. Cần nắng trực tiếp.',imgs.agave,0,89);
  p('xuong-rong-decor','Xương Rồng Columnar 30-40cm','xuong-rong-columnar-30-40cm',250000,300000,'Xương rồng dạng cột cao 30-40cm, xanh đậm. Trang trí bàn tiếp tân, góc phòng công ty hoặc nhà riêng.',c_cactus,imgs.cactus2,1,78);
  p('xuong-rong-decor','Opuntia Trang Trí Lớn','opuntia-trang-tri-lon',220000,null,'Opuntia (xương rồng bẹ) với các tấm bẹ dẹt hình bầu dục độc đáo. Tạo điểm nhấn thị giác cho sân vườn.',c_cactus,imgs.cactus1,0,64);
  p('xuong-rong-decor','Euphorbia Candelabra Lớn','euphorbia-candelabra-lon',420000,500000,'Euphorbia candelabrum — hình dạng cây nến khổng lồ, cao 60-80cm. Điểm nhấn trang trí nội thất sang trọng.','Tưới 1 lần/tháng. Cần ánh sáng tốt.',imgs.cactus2,1,34);
  p('xuong-rong-decor','Cây Yucca Trang Trí','cay-yucca-trang-tri',380000,450000,'Yucca — cây trang trí nội thất thời thượng với tán lá dài nhọn đặc trưng. Rất phổ biến trong thiết kế nội thất hiện đại.','Tưới 1-2 lần/tuần. Cần nắng tốt. Chịu khô.',imgs.agave,1,91);
  p('xuong-rong-decor','Agave Americana Lớn','agave-americana-lon',350000,420000,'Agave americana kích thước lớn, lá gai nhọn xanh xám. Rất phù hợp trang trí sân thượng, sân vườn nhiều nắng.','Tưới 2 tuần/lần. Cần nắng trực tiếp. Chịu hạn xuất sắc.',imgs.agave,0,47);
  p('xuong-rong-decor','Xương Rồng Cột Xanh 25-30cm','xuong-rong-cot-xanh-25-30cm',290000,350000,'Xương rồng dạng cột xanh đậm, cao 25-30cm. Dễ chăm sóc, thích hợp trang trí góc phòng, ban công.',c_cactus,imgs.cactus2,0,82);
  p('xuong-rong-decor','Aloe Vera Lớn Dược Liệu','aloe-vera-lon-duoc-lieu',150000,null,'Cây lô hội (aloe vera) kích thước lớn — vừa là cây cảnh đẹp vừa là dược liệu quý: chữa bỏng, dưỡng da.','Tưới 2 tuần/lần. Cần nhiều nắng. Đất thoát nước tốt.',imgs.aloe,1,412);
  p('xuong-rong-decor','Pachycereus Cactus Trang Trí','pachycereus-cactus-trang-tri',280000,320000,'Pachycereus — xương rồng thân trụ nhiều khía, cao 40-50cm. Màu xanh xám đặc trưng, trang trí sang trọng.','Tưới 3-4 tuần/lần. Cần nắng trực tiếp.',imgs.cactus2,0,59);
  p('xuong-rong-decor','Euphorbia Grandicornis Sừng Lớn','euphorbia-grandicornis-sung-lon',240000,null,'Euphorbia grandicornis — còn gọi là xương rồng sừng bò. Hình dáng độc đáo với cặp gai to như sừng.','Tưới 1 lần/tháng. Cần nắng. Cẩn thận nhựa độc.',imgs.cactus2,0,71);
  p('xuong-rong-decor','Xương Rồng San Hô Đỏ','xuong-rong-san-ho-do',200000,240000,'Euphorbia tirucalli (san hô đỏ) — cành nhỏ mảnh màu đỏ cam rực rỡ, rất độc đáo và ấn tượng.','Tưới 2-3 tuần/lần. Cần nắng. Nhựa kích ứng da.',imgs.cactus3,1,98);

  // --- Các Loại Cây Khác ---
  p('cay-khac','Cây Monstera Deliciosa - Lá Rách','cay-monstera-deliciosa',280000,350000,'Monstera Deliciosa (cây lá rách) — biểu tượng của phong trào cây cảnh trong nhà. Lá to, xanh bóng với lỗ tự nhiên độc đáo.',c_low,imgs.monstera,1,312);
  p('cay-khac','Cây Pothos - Trầu Bà Vàng','cay-pothos-trau-ba-vang',120000,150000,'Pothos (trầu bà vàng) — loài cây leo đơn giản nhất để trồng trong nhà. Lá xanh vàng óng, buông rủ đẹp mắt.',c_low,imgs.pothos,1,445);
  p('cay-khac','Cây Lưỡi Hổ - Sansevieria','cay-luoi-ho-sansevieria',199000,null,'Sansevieria (lưỡi hổ) — lọc không khí tốt nhất, cực kỳ dễ sống, chịu bóng tối và ít nước.','Tưới 2-3 tuần/lần. Chịu bóng rất tốt.',imgs.sanseveria,1,389);
  p('cay-khac','Cây ZZ Plant - Kim Tiền','cay-zz-plant-kim-tien',320000,380000,'ZZ Plant (kim tiền) — chịu hạn và bóng tối xuất sắc. Lá bóng xanh đậm. Biểu tượng tài lộc trong phong thủy.','Tưới 3-4 tuần/lần. Chịu bóng xuất sắc.',imgs.zz,1,201);
  p('cay-khac','Hoa Lan Hồ Điệp Trắng','hoa-lan-ho-diep-trang',450000,550000,'Lan hồ điệp (Phalaenopsis) — hoa trắng tinh khôi, bền đẹp 2-3 tháng. Thích hợp trang trí và làm quà tặng sang trọng.','Tưới 1 lần/tuần bằng cách nhúng chậu. Cần ánh sáng gián tiếp.',imgs.orchid,1,267);
  p('cay-khac','Hoa Hồng Mini Chậu','hoa-hong-mini-chau',189000,230000,'Hoa hồng mini trồng trong chậu — những bông hoa nhỏ xinh nở liên tục quanh năm. Đủ màu sắc: đỏ, hồng, vàng, trắng.','Tưới hàng ngày. Cần nắng 6 tiếng/ngày.',imgs.rose,1,334);
  p('cay-khac','Hoa Lavender Chậu','hoa-lavender-chau',160000,200000,'Lavender (oải hương) — mùi hương thư giãn nổi tiếng. Hoa tím xanh dịu dàng, vừa đẹp vừa thơm, đuổi muỗi tự nhiên.','Tưới 1-2 lần/tuần. Cần nắng đầy đủ.',imgs.lavender,0,167);
  p('cay-khac','Cây Rau Húng Quế Chậu','cay-rau-hung-que-chau',45000,null,'Húng quế (basil) tươi ngon trồng chậu. Hái lá nấu ăn hàng ngày. Trồng ban công là có rau sạch quanh năm.','Tưới hàng ngày. Cần nắng 6-8 tiếng.',imgs.herbs,0,567);
  p('cay-khac','Bộ 3 Rau Thơm Chậu Mini','bo-3-rau-thom-chau-mini',120000,null,'Bộ 3 chậu rau thơm mini: húng quế + bạc hà + sả. Dễ trồng trên ban công. Luôn có rau sạch cho bếp nhà bạn.','Tưới hàng ngày. Cần nắng.',imgs.herbs,1,345);
  p('cay-khac','Cây Lô Hội - Nha Đam','cay-lo-hoi-nha-dam',150000,null,'Lô hội (aloe vera) — cây cảnh đẹp và dược liệu quý: chữa bỏng, dưỡng da, làm đẹp. Rất dễ trồng.','Tưới 2 tuần/lần. Cần nhiều nắng.',imgs.aloe,1,412);
  p('cay-khac','Cây Bồ Đề Bonsai Mini','cay-bo-de-bonsai-mini',550000,650000,'Bonsai bồ đề mini — cây linh thiêng được tạo dáng nghệ thuật. Lá nhỏ xanh mướt, thân uốn lượn tinh tế.','Tưới đều, giữ ẩm. Tỉa cành định kỳ.',imgs.bonsai,1,67);
  p('cay-khac','Tiểu Cảnh Terrarium Thủy Tinh','tieu-canh-terrarium-thuy-tinh',350000,400000,'Terrarium trong bình thủy tinh — hệ sinh thái thu nhỏ với rêu, đá, cây mini. Trang trí cực đẹp cho bàn làm việc.','Phun sương nhẹ 1 lần/tuần.',imgs.bonsai,1,123);
  p('cay-khac','Combo Quà Tặng Cây Xanh 3 Chậu','combo-qua-tang-cay-xanh-3-chau',199000,250000,'Combo 3 chậu cây mini đa dạng: 1 cây lá + 1 hoa + 1 xương rồng. Đóng gói trong hộp quà xinh kèm thiệp.',c_low,imgs.gift,1,345);
  p('cay-khac','Hộp Quà Cây Văn Phòng Cao Cấp','hop-qua-cay-van-phong-cao-cap',450000,550000,'Hộp quà cao cấp: 1 cây to + 2 cây nhỏ + chậu gốm + phân bón + hướng dẫn chăm sóc. Phù hợp tặng đối tác VIP.','Theo hướng dẫn kèm theo.',imgs.gift,1,89);

  // Articles
  const insertArt = db.prepare('INSERT INTO articles (type,title,slug,summary,content,image) VALUES (?,?,?,?,?,?)');

  insertArt.run('cham-soc','Cách Chăm Sóc Cây Cảnh Trong Nhà Cho Người Mới Bắt Đầu','cach-cham-soc-cay-canh-trong-nha',
    'Hướng dẫn toàn diện về ánh sáng, nước, đất và phân bón cho các loại cây cảnh trong nhà phổ biến.',
    `<h2>1. Ánh Sáng - Yếu Tố Quan Trọng Nhất</h2><p>Mỗi loại cây có nhu cầu ánh sáng khác nhau. Cây lá xanh đậm (monstera, pothos, sansevieria) chịu bóng tốt. Cây hoa và cây lá màu cần nhiều ánh sáng hơn để ra hoa.</p><h2>2. Tưới Nước Đúng Cách</h2><p>Nguyên tắc vàng: kiểm tra đất trước khi tưới. Đút ngón tay 3-4cm vào đất, nếu còn ẩm thì chưa cần tưới. Tưới thấm đến khi nước chảy ra đáy chậu.</p><h2>3. Chọn Đất Phù Hợp</h2><p>Đa số cây trong nhà cần đất tơi xốp, thoát nước tốt. Trộn đất vườn + phân hữu cơ + trấu hun theo tỷ lệ 3:1:1.</p><h2>4. Bón Phân</h2><p>Bón phân NPK loãng 1 lần/tháng trong mùa xuân-hè. Giảm xuống 1 lần/2 tháng vào thu-đông.</p>`,
    imgs.monstera);

  insertArt.run('cham-soc','Bí Quyết Chăm Sóc Xương Rồng & Sen Đá Luôn Tươi Đẹp','bi-quyet-cham-soc-xuong-rong-sen-da',
    'Hướng dẫn chi tiết cách chăm sóc xương rồng và sen đá để cây luôn khỏe mạnh, đẹp và ra hoa.',
    `<h2>Hiểu Về Nhu Cầu Của Xương Rồng</h2><p>Xương rồng và sen đá là loài cây sa mạc, thích nghi với môi trường khô hạn. Điều quan trọng nhất là KHÔNG tưới quá nhiều nước.</p><h2>Tưới Nước Đúng Cách</h2><p>Tưới đẫm rồi để đất khô hoàn toàn mới tưới lại. Mùa hè 2 tuần/lần, mùa đông 1 tháng/lần. Tuyệt đối không để nước đọng trong lòng chậu.</p><h2>Ánh Sáng Cho Xương Rồng</h2><p>Hầu hết xương rồng cần nắng trực tiếp 4-6 tiếng/ngày. Đặt ở ban công hoặc cửa sổ hướng Nam là lý tưởng nhất.</p><h2>Đất Và Chậu</h2><p>Dùng đất chuyên dụng xương rồng hoặc pha thêm 50% cát thô. Chậu đất nung thấm nước tốt hơn chậu nhựa.</p>`,
    imgs.cactus1);

  insertArt.run('cham-soc','Trồng Rau Sạch Tại Nhà Trên Ban Công Đơn Giản','trong-rau-sach-tai-nha-tren-ban-cong',
    'Hướng dẫn từng bước trồng rau thơm, rau ăn lá ngay tại ban công nhỏ. Luôn có rau sạch hữu cơ cho gia đình.',
    `<h2>Chuẩn Bị Dụng Cụ</h2><p>Cần: chậu có lỗ thoát nước (đường kính 20-30cm), đất trồng rau chuyên dụng, hạt giống hoặc cây giống, phân hữu cơ vi sinh.</p><h2>Các Loại Rau Dễ Trồng Nhất</h2><p>Người mới nên bắt đầu với: rau muống (30 ngày), cải xanh (25-30 ngày), húng quế (30-40 ngày), xà lách (35-45 ngày).</p><h2>Kỹ Thuật Gieo Hạt</h2><p>Ngâm hạt 6-8 tiếng trong nước ấm trước khi gieo. Gieo hạt sâu 1-2cm, cách nhau 5-7cm. Tưới ẩm mỗi ngày.</p>`,
    imgs.herbs);

  insertArt.run('thong-tin','Top 10 Cây Cảnh Lọc Không Khí Tốt Nhất Cho Nhà Và Văn Phòng','top-10-cay-canh-loc-khong-khi',
    'NASA đã nghiên cứu và chứng minh những loài cây này có khả năng lọc chất độc hại trong không khí hiệu quả nhất.',
    `<h2>Nghiên Cứu NASA</h2><p>Năm 1989, NASA thực hiện nghiên cứu về khả năng lọc không khí của cây xanh. Kết quả cho thấy nhiều loài cây thông thường có thể loại bỏ formaldehyde, benzene và các chất độc.</p><h2>Top Cây Lọc Không Khí</h2><p><strong>1. Lưỡi hổ (Sansevieria)</strong>: Lọc formaldehyde, xylene, toluene, benzene.</p><p><strong>2. Trầu bà/Pothos</strong>: Loại bỏ formaldehyde, xylene và benzene.</p><p><strong>3. Bạch môn (Peace Lily)</strong>: Lọc nhiều chất độc nhất, kể cả acetone.</p><p><strong>4. Dracaena</strong>: Rất hiệu quả với trichloroethylene và xylene.</p>`,
    imgs.sanseveria);

  insertArt.run('thong-tin','Ý Nghĩa Phong Thủy Của Các Loại Cây Cảnh Phổ Biến','y-nghia-phong-thuy-cay-canh-pho-bien',
    'Tìm hiểu ý nghĩa phong thủy của từng loại cây cảnh: cây nào mang tài lộc, cây nào xua đuổi tà khí.',
    `<h2>Cây Kim Tiền (ZZ Plant)</h2><p>Biểu tượng tài lộc số 1 trong phong thủy. Đặt tại góc tài lộc (Đông Nam) để tăng tài vận.</p><h2>Lưỡi Hổ (Sansevieria)</h2><p>Mang lại sức mạnh và bảo vệ. Đặt hai bên cổng hoặc cửa vào để bảo vệ gia đình.</p><h2>Xương Rồng Cầu Vàng</h2><p>Hình tròn tượng trưng cho sự viên mãn và tiền bạc dồi dào. Đặt trên bàn làm việc để thu hút tài lộc.</p><h2>Trầu Bà (Pothos)</h2><p>Tượng trưng cho sự phát triển và thịnh vượng liên tục. Dây leo dài ra tượng trưng cho sự phát triển không ngừng.</p>`,
    imgs.zz);

  insertArt.run('thong-tin','Hướng Dẫn Chọn Cây Cảnh Phù Hợp Với Không Gian Sống','huong-dan-chon-cay-canh-phu-hop',
    'Cách chọn cây cảnh đúng theo diện tích, ánh sáng, phong cách nội thất và ngân sách.',
    `<h2>Đánh Giá Điều Kiện Nhà Bạn</h2><p>Trước khi chọn cây, cần xác định: nhà hướng nào (ánh sáng nhiều hay ít?), diện tích đặt cây, phong cách nội thất, và thời gian có thể dành để chăm sóc.</p><h2>Nhà Ít Ánh Sáng</h2><p>Chọn: lưỡi hổ, ZZ plant, pothos, sansevieria. Tránh: xương rồng, hoa hồng, lavender.</p><h2>Người Bận Rộn</h2><p>Ưu tiên cây chịu hạn: ZZ plant, lưỡi hổ, xương rồng, sen đá. Đây là những cây có thể không tưới 2-3 tuần mà không chết.</p><h2>Muốn Cây Ra Hoa</h2><p>Lan hồ điệp, hoa hồng mini, lavender là những lựa chọn tốt cho nhà.</p>`,
    imgs.garden);

  console.log('✅ Seed hoàn thành: 3 danh mục, 40 sản phẩm, 6 bài viết');
}

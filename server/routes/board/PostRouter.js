const express = require('express');

const router = express.Router();
const db = require('../../dbConnection')();
const authMiddleware = require('../../middleware/auth');
const { info } = require('../../log-config');
const { set } = require('../../middleware/latelyCookie');

const conn = db.init();

const point = require('../../middleware/point');

router.get('/', (req, res) => {
  let { currentPage } = req.query;
  const { board, userId } = req.query;
  currentPage = currentPage || 1;

  const query = `
    SELECT 
      @rownum:=@rownum+1 as rn
        , (SELECT Ceil(COUNT(*)/25) FROM GTC_BOARD_POST WHERE B_ID = '${board.toUpperCase()}'
        AND WRITER != IFNULL(( SELECT TARGET_ID FROM GTC_USER_IGNORE WHERE FROM_ID = ${userId}), -1)) AS pageCount
        , P.ID AS id
        , P.TITLE AS title
        , (SELECT U.NICKNAME FROM GTC_USER U WHERE U.ID = P.WRITER) AS writer
        , IF(BC_ID = 'FREE','자유','그외') as categoryName
        , P.DEPTH AS depth
        , if(DATE_FORMAT(SYSDATE(), '%Y%m%d') = DATE_FORMAT(P.DATE, '%Y%m%d'),DATE_FORMAT(P.DATE, '%H:%i'),DATE_FORMAT(P.DATE, '%m-%d')) AS date
        , ( SELECT COUNT(*) AS count FROM GTC_BOARD_POST_RECOMMEND WHERE ID=P.id AND TYPE='R01') as recommendCount
        , ( SELECT COUNT(*) AS count FROM GTC_BOARD_REPLY R WHERE BP_ID=P.id AND R.WRITER != IFNULL(( SELECT TARGET_ID FROM GTC_USER_IGNORE WHERE FROM_ID = ${userId}), -1)) as replyCount
    FROM GTC_BOARD_POST P, (SELECT @ROWNUM := ${(currentPage - 1) * 25}) AS TEMP
    WHERE P.B_ID = '${board.toUpperCase()}' AND P.WRITER != IFNULL(( SELECT TARGET_ID FROM GTC_USER_IGNORE WHERE FROM_ID = ${userId}), -1)
    ORDER BY ID DESC    
    LIMIT ${(currentPage - 1) * 25}, 25
    `;

  conn.query(query, (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});

router.use('/', authMiddleware);
router.post('/', (req, res) => {
  const data = req.body;
  const query = `INSERT INTO GTC_BOARD_POST
    VALUES(
    (SELECT * FROM (SELECT IFNULL(MAX(ID)+1,1) FROM GTC_BOARD_POST) as temp),
    '${data.board}',
    '${data.category}',
    null,
    '${data.title}',
    '${data.writer}',
    sysdate(),
    0,
    '${data.content}',
     ${data.depth},
     '${data.secret}',
     '${data.secretReplyAllow}',
     '${data.replyAllow}'
    )`;

  conn.query(query, (err) => {
    if (err) throw err;

    conn.query('SELECT IFNULL(MAX(ID), 1) AS id FROM GTC_BOARD_POST', (err2, rows) => {
      if (err2) throw err2;

      const postData = {
        ...data,
        bpId: rows[0].id,
      };

      point('addPost', 'POST', postData);
      res.send(true);
    });
  });
});

// 게시글 추천
router.post('/recommend', (req, res) => {
  const data = req.body;
  let query = `SELECT COUNT(*) AS count FROM GTC_BOARD_POST_RECOMMEND
    WHERE ID=${data.id}
    AND U_ID=${data.uId}`;
  conn.query(query, (err, rows) => {
    if (err) throw err;

    // 이미 해당 댓글에 해당 유저가 좋아요를 누름.
    if (rows[0].count === 1) {
      res.send(2);
    } else {
      query = `INSERT INTO GTC_BOARD_POST_RECOMMEND
        VALUES (
          ${data.id},
          ${data.uId},
          '${data.type}'
        )`;

      conn.query(query, (err2) => {
        if (err2) throw err2;

        res.send(1);
      });
    }
  });
});

router.get('/mine', (req, res) => {
  const { userId } = req.query;
  const query = `SELECT ID AS postId, TITLE AS postTitle, date_format(DATE, '%Y-%m-%d %H:%i:%s') AS postDate, VIEWS AS postViews
    FROM GTC_BOARD_POST
    WHERE WRITER = ${userId}
    `;

  conn.query(query, (err, rows) => {
    if (err) throw err;
    if (rows.length >= 1) {
      res.send(rows.reverse());
    } else {
      res.send(rows);
    }
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  let query = `SELECT P.ID AS id
        , P.B_ID AS board
        , if(P.B_ID = 'FREE','자유게시판','그외') as boardName
        , P.BC_ID AS category
        , if(P.BC_ID = 'FREE','자유','그외') as categoryName
        , if((SELECT F.POST_ID FROM GTC_USER_FAVORITE F WHERE F.USER_ID = ${userId} AND F.POST_ID = P.ID), true, false) as isFavorite
        , P.TITLE AS title
        , (SELECT U.NICKNAME FROM GTC_USER U WHERE U.ID = P.WRITER) AS writer
        , P.DEPTH AS depth
        , ( SELECT COUNT(*) AS count FROM GTC_BOARD_POST_RECOMMEND WHERE ID=P.id AND TYPE='R01') as recommendCount
        , ( SELECT COUNT(*) AS count FROM GTC_BOARD_POST_RECOMMEND WHERE ID=P.id AND TYPE='R02') as notRecommendCount
        , CASE WHEN DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 MINUTE),'%Y-%m-%d %H:%i:%s') THEN '몇초 전'
                    WHEN DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 HOUR),'%Y-%m-%d %H:%i:%s') THEN CONCAT(TIMESTAMPDIFF(MINUTE,DATE, SYSDATE()),'분 전')
                    WHEN DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 DAY),'%Y-%m-%d %H:%i:%s') THEN CONCAT(TIMESTAMPDIFF(HOUR,DATE, SYSDATE()),'시간 전')
                    WHEN DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 MONTH),'%Y-%m-%d %H:%i:%s') THEN CONCAT(TIMESTAMPDIFF(DAY,DATE, SYSDATE()),'일 전')
                    WHEN DATE > DATE_FORMAT(DATE_ADD(sysdate(),INTERVAL -1 YEAR),'%Y-%m-%d %H:%i:%s') THEN CONCAT(TIMESTAMPDIFF(MONTH,DATE, SYSDATE()),'달 전')
                   ELSE CONCAT(TIMESTAMPDIFF(YEAR,DATE, SYSDATE()),'년 전')
               END  as date
        , P.CONTENT AS content
        , P.VIEWS AS views
        , P.SECRET as secret
        , P.SECRET_REPLY_ALLOW as secretReplyAllow
        , P.REPLY_ALLOW as replyAllow
    FROM GTC_BOARD_POST P
    WHERE ID = ${id}`;

  conn.query(query, (err, rows) => {
    if (err) throw err;
    query = `UPDATE GTC_BOARD_POST
        SET VIEWS = VIEWS + 1
        WHERE ID = ${req.params.id}`;

    // 정상적으로 조회가 되었다면 조회수 +1
    conn.query(query, (err2) => {
      if (err2) throw err2;

      const { lately } = req.cookies;
      const list = set(lately, req.params.id);
      res.cookie('lately', list, { httpOnly: true });
      res.send(rows);
    });
  });
});

router.get('/:id/upperLower', (req, res) => {
  const query = `SELECT *, IF(id > ${req.params.id}, 'upper', 'lower') AS upperOrLower FROM (
        SELECT 
              @ROWNUM := @ROWNUM + 1 as rn
                , P.ID AS id
                , P.TITLE AS title
                , (SELECT U.NICKNAME FROM GTC_USER U WHERE U.ID = P.WRITER) AS writer
            FROM GTC_BOARD_POST P, (SELECT @ROWNUM := 0) AS TEMP
            WHERE B_ID = (SELECT B_ID FROM GTC_BOARD_POST WHERE ID =  ${req.params.id})
            ORDER BY ID DESC    
        ) AS B
        WHERE B.rn IN (
        ((SELECT rn FROM (
                SELECT 
                      @ROWNUM2 := @ROWNUM2 + 1 as rn 
                        , P.ID AS id
                        FROM GTC_BOARD_POST P,  (SELECT @ROWNUM2 := 0) AS TEMP
                        WHERE P.B_ID = (SELECT B_ID FROM GTC_BOARD_POST WHERE ID =  ${req.params.id})
                        ORDER BY ID DESC   
                ) AS A
                WHERE A.id = ${req.params.id}) + 1),
                ((SELECT rn FROM (
                SELECT 
                      @ROWNUM3 := @ROWNUM3 + 1 as rn 
                        , P.ID AS id
                        FROM GTC_BOARD_POST P,  (SELECT @ROWNUM3 := 0) AS TEMP
                        WHERE P.B_ID = (SELECT B_ID FROM GTC_BOARD_POST WHERE ID =  ${req.params.id})
                        ORDER BY ID DESC   
                ) AS A
                WHERE A.id = ${req.params.id}) - 1)
        )
  `;

  info(query);

  conn.query(query, (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});


module.exports = router;

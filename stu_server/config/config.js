module.exports = {
  DBHOST: '127.0.0.1',
  DBPORT: 27017,
  DBNAME: 'school',
  tokenSecret: 'zhougr_learn_node', // 用于生成token的字符串密钥
  tokenExpiredTime: 60 * 60 * 24 // token过期时间 单位：s
}
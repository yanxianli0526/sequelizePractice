## 功能介紹
其實功能蠻單純的，主要是沒用過sequelize，所以做一個簡易的訂單的小程式，功能如下：  
1.登入及權限  
2.新增product  
3.新增order  
4.刪除product的時候檢查有沒有order正在使用，沒有的話才會刪除成功  


## 執行步驟
### step.1
如果local已經有資料庫可以修改 `app/config/db.config.js`  確保資料庫可以正常連線.(有資料庫的也可以參考DB章節的匯入,快速建立測試資料)  
如果local沒有的資料庫話可以參考最下面的DB章節,可以透用docker快速建立一個資料庫以及匯入一些測試資料.
### step.2
```
yarn
```
### step.3
```
yarn start
```

### How to test
```
yarn test
```

## Postman

可以透過postman匯入sequelizeTest.postman_collection.json和環境變數sequelizeTestEnv.postman_environment.json更快速了解api如何使用.



## DB
資料庫

postgresql 設定

```
docker pull postgres:14.9
```

```
docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=test -e POSTGRES_USER=test -e POSTGRES_DB=sequelizeTest postgres:14.9
```

```
docker cp ./backup.sql postgres:/file.sql
```

```
docker exec -u postgres postgres psql sequelizeTest postgres -f /file.sql
```

### 匯出資料

```
pg_dump -U postgres -d sequelizeTest -f backup.sql
```

### 匯入資料

```
psql -U postgres -d sequelizeTest -f backup.sql
```

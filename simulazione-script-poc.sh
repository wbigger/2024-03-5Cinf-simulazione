#!/bin/bash -xe
sudo apt update -y
sudo apt install nodejs unzip wget npm mysql-server git -y
cd /home/ubuntu
git clone https://github.com/wbigger/2024-03-5Cinf-simulazione
mv 2024-03-5Cinf-simulazione/resources/ .
cd resources/codebase_partner
npm install aws aws-sdk
sudo mysql -u root -e "CREATE USER 'nodeapp' IDENTIFIED WITH mysql_native_password BY 'student12'";
sudo mysql -u root -e "GRANT all privileges on *.* to 'nodeapp'@'%';"
sudo mysql -u root -e "CREATE DATABASE ORDERS;"
sudo mysql -u root -e "USE ORDERS; CREATE TABLE orders(
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            price VARCHAR(255) NOT NULL,
            PRIMARY KEY ( id ));"
sudo sed -i 's/.*bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl enable mysql
sudo service mysql restart
sudo APP_PORT=8080 APP_DB_HOST=localhost APP_DB_USER=nodeapp APP_DB_PASSWORD=student12 APP_DB_NAME=ORDERS npm start &
echo '#!/bin/bash -xe
cd /home/ubuntu/resources/codebase_partner
export APP_PORT=8080
npm start' | sudo tee /etc/rc.local
sudo chmod +x /etc/rc.local

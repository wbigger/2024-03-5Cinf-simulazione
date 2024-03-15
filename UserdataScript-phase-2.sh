#!/bin/bash -xe
sudo apt update -y
sudo apt install nodejs unzip wget npm mysql-server -y
wget https://aws-tc-largeobjects.s3.us-west-2.amazonaws.com/CUR-TF-200-ACCAP1-1-DEV/code.zip -P /home/ubuntu
cd /home/ubuntu
unzip code.zip -x "resources/codebase_partner/node_modules/*"
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
export APP_DB_HOST=$(curl http://169.254.169.254/latest/meta-data/local-ipv4)
export APP_DB_USER=nodeapp
export APP_DB_PASSWORD=student12
export APP_DB_NAME=ORDERS
export APP_PORT=8080
sudo -E npm start &
echo '#!/bin/bash -xe
cd /home/ubuntu/resources/codebase_partner
export APP_PORT=80
npm start' | sudo tee /etc/rc.local
sudo chmod +x /etc/rc.local

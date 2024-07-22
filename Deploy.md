### Step 1: Set Up Your Droplet
 Use SSH to connect to your Droplet.
```sh
ssh root@your_droplet_ip
```
### Step 2: Install Necessary Software
Update and Upgrade Packages:
```sh
sudo apt update && sudo apt upgrade -y
```
### Install Node.js and npm:
```sh
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs
```
### Install Git:
```sh
sudo apt install git -y
```
### Install pm2:
pm2 is used to keep your Next.js application running.
```sh
sudo npm install -g pm2
```
### Step 3: Clone Your Repository
Clone Your Next.js Application:
```sh
git clone https://github.com/your_username/your_nextjs_repo.git
cd your_nextjs_repo
```
Step 4: Configure Environment Variables
Create a .env.local file:
Add your environment variables in the .env.local file.
bash
Copy code
touch .env.local
nano .env.local
Add your environment variables and save the file.
Step 5: Install Dependencies and Build
Install Dependencies:

bash
Copy code
npm install
Build Your Application:

bash
Copy code
npm run build
Step 6: Start Your Application with pm2
Start the Application:

bash
Copy code
pm2 start npm --name "nextjs-app" -- start
Save the pm2 Process List:

bash
Copy code
pm2 save
Set pm2 to Start on Boot:

bash
Copy code
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your_username --hp /home/your_username
Step 7: Set Up Nginx as a Reverse Proxy
Install Nginx:

bash
Copy code
sudo apt install nginx -y
Configure Nginx:

Create a new Nginx configuration file for your Next.js application.
bash
Copy code
sudo nano /etc/nginx/sites-available/nextjs-app
Add the following configuration:
nginx
Copy code
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
Enable the configuration by creating a symbolic link to sites-enabled.
bash
Copy code
sudo ln -s /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/
Test Nginx Configuration and Restart:

bash
Copy code
sudo nginx -t
sudo systemctl restart nginx
Step 8: Secure Your Application with SSL
Install Certbot:

bash
Copy code
sudo apt install certbot python3-certbot-nginx -y
Obtain SSL Certificate:

bash
Copy code
sudo certbot --nginx -d your_domain
Automatically Renew SSL:

bash
Copy code
sudo crontab -e
Add the following line to the crontab file:
bash
Copy code
0 0 * * * /usr/bin/certbot renew --quiet
sudo apt-get update

# Install fail2ban
sudo apt install fail2ban -y
sudo cp /etc/fail2ban/jail.{conf,local}
sudo sed -i 's/bantime  = 10m/bantime  = 1d/' /etc/fail2ban/jail.local
sudo systemctl restart fail2ban

# Add sudo user
sudo useradd -m tommy
#sudo echo "tommy:XXXXXXXXX" | chpasswd
sudo usermod -a -G sudo tommy
sudo mkdir /home/tommy/.ssh
sudo cp /root/.ssh/authorized_keys /home/tommy/.ssh/
sudo chown -R tommy:tommy /home/tommy
sudo echo 'tommy ALL=(ALL:ALL) ALL' | sudo EDITOR='tee -a' visudo

# Docker
sudo apt-get install ca-certificates curl gnupg lsb-release
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
sudo echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

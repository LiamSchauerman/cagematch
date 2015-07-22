# Use centos 6 as the base OS
FROM centos:centos6
MAINTAINER liam

# Install all the things
RUN yum update -y
RUN yum install -y git epel-release tar which wget unzip curl xz
RUN yum groupinstall -y "Development Tools"
RUN wget http://www.python.org/ftp/python/2.7.6/Python-2.7.6.tar.xz
RUN xz -d Python-2.7.6.tar.xz
RUN tar -xvf Python-2.7.6.tar; \
    cd Python-2.7.6; \
    ./configure --prefix=/usr/local; \
    make -y; \
    make altinstall -y; \
    cd ..

# Install node
RUN yum install -y nodejs npm --enablerepo=epel

# Install node, the specific version we need
RUN npm install -g inherits
RUN npm install -g n
RUN n 0.10.32

# Install forever
RUN npm install -g forever bower

RUN yum install mongodb-server -y; \
    yum install -y gcc-c++ openssl-devel; \
    npm install -g node-gyp

# Make sure we get files into the right place
#ADD . /home/cage
RUN cd /home ; \
    git clone -b docker https://github.com/LiamSchauerman/cagematch.git cage; \
    cd cage/public; \
    bower install --allow-root -n

# Expose port for prod traffic
EXPOSE 4545


# Entrypoint runs nginx as a service and node/forever as the primary process
CMD service mongod start; \
    cd /home/cage ; \
    rm -r node_modules/ ; \
    npm install ; \
    forever -o /dev/null --minUptime 1000 --spinSleepTime 1000 index.js

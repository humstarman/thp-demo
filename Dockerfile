FROM maven:3.5.4-jdk-8 as build
RUN mkdir -p /workspace/THPBuilder
ADD ./THPBuilder /workspace/THPBuilder/
RUN cd /workspace/THPBuilder && mvn package

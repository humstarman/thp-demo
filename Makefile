SHELL=/bin/bash
DOCKER_REGISTRY=10.254.0.50:5000
NAMESPACE=default
PORT=8080
TAG=v1
NAME=bj-demo
IMAGE=${DOCKER_REGISTRY}/${NAME}:${TAG}
IMAGE_PULL_POLICY=Always

all: build push deploy

build:
	@docker build -t ${IMAGE} .

push:
	@docker push ${IMAGE}

cp:
	@find ./manifests -type f -name "*.sed" | sed s?".sed"?""?g | xargs -I {} cp {}.sed {}

sed:
	@find ./manifests -type f -name "*.yaml" | xargs sed -i s?"{{.name}}"?"${NAME}"?g
	@find ./manifests -type f -name "*.yaml" | xargs sed -i s?"{{.namespace}}"?"${NAMESPACE}"?g
	@find ./manifests -type f -name "*.yaml" | xargs sed -i s?"{{.port}}"?"${PORT}"?g
	@find ./manifests -type f -name "*.yaml" | xargs sed -i s?"{{.image}}"?"${IMAGE}"?g
	@find ./manifests -type f -name "*.yaml" | xargs sed -i s?"{{.image.pull.policy}}"?"${IMAGE_PULL_POLICY}"?g

deploy: cp sed
	@kubectl create -f ./manifests/.

clean:
	@kubectl delete -f ./manifests/.
	@find ./manifests -type f -name "*.yaml" | xargs rm -f

del-pod:
	@./scripts/del-pod.sh -n demo1 -s ${NAMESPACE}

test:
	@docker run -it --rm 10.254.0.50:5000/bj-demo:v1 /bin/sh

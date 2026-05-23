# CloudApp — Backend

Spring Boot REST API for VM management platform.

## Tech stack
- Java 17 + Spring Boot 3
- Spring Security + JWT
- MySQL + Hibernate
- Docker
- VMware REST API proxy

## Run locally
```bash
mvn clean package -DskipTests
java -jar target/Spring_Security_JWT-0.0.1-SNAPSHOT.jar
```

## Run with Docker
```bash
docker-compose up
```

## API endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register |
| POST | /api/auth/signin | Login |
| GET | /api/machines/my | My VMs |
| GET | /vmware/vms | All VMware VMs |
| PUT | /vmware/vms/{id}/power | Power on/off |
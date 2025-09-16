# --------- Builder Stage ---------
FROM maven:3.9.9-eclipse-temurin-23 AS builder

WORKDIR /app

# Copy only pom.xml to cache dependencies
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the jar
RUN mvn clean package -DskipTests

# --------- Runner Stage ---------
FROM eclipse-temurin:23-jdk AS runner

WORKDIR /app

# Copy built jar from builder
COPY --from=builder /app/target/file-service-0.0.1-SNAPSHOT.jar app.jar


# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]

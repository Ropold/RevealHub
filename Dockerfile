FROM --platform=linux/amd64 openjdk:21
LABEL authors="ropold"
EXPOSE 8080
COPY backend/target/revealhub.jar revealhub.jar
ENTRYPOINT ["java", "-jar", "revealhub.jar"]
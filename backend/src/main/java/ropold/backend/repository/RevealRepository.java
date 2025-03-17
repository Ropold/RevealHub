package ropold.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ropold.backend.model.RevealModel;

public interface RevealRepository extends MongoRepository<RevealModel, String> {
}

package edu.usc.csci310.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoritesRepository extends JpaRepository<Favorite, String> {
    Favorite findByUsername(String username);
}


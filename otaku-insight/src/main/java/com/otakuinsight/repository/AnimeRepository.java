package com.otakuinsight.repository;

import com.otakuinsight.entity.AnimeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnimeRepository extends JpaRepository<AnimeEntity, Long> {

    Optional<AnimeEntity> findByTitleContainingIgnoreCase(String title);

}
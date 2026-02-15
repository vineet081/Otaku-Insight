package com.otakuinsight.repository;

import com.otakuinsight.entity.AnimeEntity;
import com.otakuinsight.entity.EpisodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpisodeRepository extends JpaRepository<EpisodeEntity, Long> {

    List<EpisodeEntity> findByAnime(AnimeEntity anime);

}

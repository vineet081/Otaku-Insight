package com.otakuinsight.controller;

import com.otakuinsight.dto.AnimeDTO;
import com.otakuinsight.service.AnimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/anime")
public class AnimeController {

    @Autowired
    private AnimeService animeService;

    @GetMapping("/search")
    public ResponseEntity<AnimeDTO> searchAnime(@RequestParam String name) {

        try {
            AnimeDTO anime = animeService.searchAnime(name);
            return ResponseEntity.ok(anime);

        } catch (IllegalArgumentException e) {
            // Bad request - invalid input
            return ResponseEntity.badRequest().build();

        } catch (RuntimeException e) {
            // Not found or other error
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.JhipsterTestApp;
import com.mycompany.myapp.domain.Tareas;
import com.mycompany.myapp.repository.TareasRepository;
import com.mycompany.myapp.repository.search.TareasSearchRepository;
import com.mycompany.myapp.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.domain.enumeration.Estado;
/**
 * Integration tests for the {@link TareasResource} REST controller.
 */
@SpringBootTest(classes = JhipsterTestApp.class)
public class TareasResourceIT {

    private static final String DEFAULT_RESPONSABLE = "AAAAAAAAAA";
    private static final String UPDATED_RESPONSABLE = "BBBBBBBBBB";

    private static final String DEFAULT_TITULO = "AAAAAAAAAA";
    private static final String UPDATED_TITULO = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final Estado DEFAULT_ESTADO = Estado.NUEVA;
    private static final Estado UPDATED_ESTADO = Estado.ENCURSO;

    private static final Instant DEFAULT_FECHAFIN = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FECHAFIN = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_FECHAFIN = Instant.ofEpochMilli(-1L);

    @Autowired
    private TareasRepository tareasRepository;

    /**
     * This repository is mocked in the com.mycompany.myapp.repository.search test package.
     *
     * @see com.mycompany.myapp.repository.search.TareasSearchRepositoryMockConfiguration
     */
    @Autowired
    private TareasSearchRepository mockTareasSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restTareasMockMvc;

    private Tareas tareas;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TareasResource tareasResource = new TareasResource(tareasRepository, mockTareasSearchRepository);
        this.restTareasMockMvc = MockMvcBuilders.standaloneSetup(tareasResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tareas createEntity(EntityManager em) {
        Tareas tareas = new Tareas()
            .responsable(DEFAULT_RESPONSABLE)
            .titulo(DEFAULT_TITULO)
            .descripcion(DEFAULT_DESCRIPCION)
            .estado(DEFAULT_ESTADO)
            .fechafin(DEFAULT_FECHAFIN);
        return tareas;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tareas createUpdatedEntity(EntityManager em) {
        Tareas tareas = new Tareas()
            .responsable(UPDATED_RESPONSABLE)
            .titulo(UPDATED_TITULO)
            .descripcion(UPDATED_DESCRIPCION)
            .estado(UPDATED_ESTADO)
            .fechafin(UPDATED_FECHAFIN);
        return tareas;
    }

    @BeforeEach
    public void initTest() {
        tareas = createEntity(em);
    }

    @Test
    @Transactional
    public void createTareas() throws Exception {
        int databaseSizeBeforeCreate = tareasRepository.findAll().size();

        // Create the Tareas
        restTareasMockMvc.perform(post("/api/tareas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tareas)))
            .andExpect(status().isCreated());

        // Validate the Tareas in the database
        List<Tareas> tareasList = tareasRepository.findAll();
        assertThat(tareasList).hasSize(databaseSizeBeforeCreate + 1);
        Tareas testTareas = tareasList.get(tareasList.size() - 1);
        assertThat(testTareas.getResponsable()).isEqualTo(DEFAULT_RESPONSABLE);
        assertThat(testTareas.getTitulo()).isEqualTo(DEFAULT_TITULO);
        assertThat(testTareas.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
        assertThat(testTareas.getEstado()).isEqualTo(DEFAULT_ESTADO);
        assertThat(testTareas.getFechafin()).isEqualTo(DEFAULT_FECHAFIN);

        // Validate the Tareas in Elasticsearch
        verify(mockTareasSearchRepository, times(1)).save(testTareas);
    }

    @Test
    @Transactional
    public void createTareasWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tareasRepository.findAll().size();

        // Create the Tareas with an existing ID
        tareas.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTareasMockMvc.perform(post("/api/tareas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tareas)))
            .andExpect(status().isBadRequest());

        // Validate the Tareas in the database
        List<Tareas> tareasList = tareasRepository.findAll();
        assertThat(tareasList).hasSize(databaseSizeBeforeCreate);

        // Validate the Tareas in Elasticsearch
        verify(mockTareasSearchRepository, times(0)).save(tareas);
    }


    @Test
    @Transactional
    public void getAllTareas() throws Exception {
        // Initialize the database
        tareasRepository.saveAndFlush(tareas);

        // Get all the tareasList
        restTareasMockMvc.perform(get("/api/tareas?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tareas.getId().intValue())))
            .andExpect(jsonPath("$.[*].responsable").value(hasItem(DEFAULT_RESPONSABLE.toString())))
            .andExpect(jsonPath("$.[*].titulo").value(hasItem(DEFAULT_TITULO.toString())))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION.toString())))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO.toString())))
            .andExpect(jsonPath("$.[*].fechafin").value(hasItem(DEFAULT_FECHAFIN.toString())));
    }
    
    @Test
    @Transactional
    public void getTareas() throws Exception {
        // Initialize the database
        tareasRepository.saveAndFlush(tareas);

        // Get the tareas
        restTareasMockMvc.perform(get("/api/tareas/{id}", tareas.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(tareas.getId().intValue()))
            .andExpect(jsonPath("$.responsable").value(DEFAULT_RESPONSABLE.toString()))
            .andExpect(jsonPath("$.titulo").value(DEFAULT_TITULO.toString()))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION.toString()))
            .andExpect(jsonPath("$.estado").value(DEFAULT_ESTADO.toString()))
            .andExpect(jsonPath("$.fechafin").value(DEFAULT_FECHAFIN.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTareas() throws Exception {
        // Get the tareas
        restTareasMockMvc.perform(get("/api/tareas/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTareas() throws Exception {
        // Initialize the database
        tareasRepository.saveAndFlush(tareas);

        int databaseSizeBeforeUpdate = tareasRepository.findAll().size();

        // Update the tareas
        Tareas updatedTareas = tareasRepository.findById(tareas.getId()).get();
        // Disconnect from session so that the updates on updatedTareas are not directly saved in db
        em.detach(updatedTareas);
        updatedTareas
            .responsable(UPDATED_RESPONSABLE)
            .titulo(UPDATED_TITULO)
            .descripcion(UPDATED_DESCRIPCION)
            .estado(UPDATED_ESTADO)
            .fechafin(UPDATED_FECHAFIN);

        restTareasMockMvc.perform(put("/api/tareas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTareas)))
            .andExpect(status().isOk());

        // Validate the Tareas in the database
        List<Tareas> tareasList = tareasRepository.findAll();
        assertThat(tareasList).hasSize(databaseSizeBeforeUpdate);
        Tareas testTareas = tareasList.get(tareasList.size() - 1);
        assertThat(testTareas.getResponsable()).isEqualTo(UPDATED_RESPONSABLE);
        assertThat(testTareas.getTitulo()).isEqualTo(UPDATED_TITULO);
        assertThat(testTareas.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testTareas.getEstado()).isEqualTo(UPDATED_ESTADO);
        assertThat(testTareas.getFechafin()).isEqualTo(UPDATED_FECHAFIN);

        // Validate the Tareas in Elasticsearch
        verify(mockTareasSearchRepository, times(1)).save(testTareas);
    }

    @Test
    @Transactional
    public void updateNonExistingTareas() throws Exception {
        int databaseSizeBeforeUpdate = tareasRepository.findAll().size();

        // Create the Tareas

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTareasMockMvc.perform(put("/api/tareas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tareas)))
            .andExpect(status().isBadRequest());

        // Validate the Tareas in the database
        List<Tareas> tareasList = tareasRepository.findAll();
        assertThat(tareasList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Tareas in Elasticsearch
        verify(mockTareasSearchRepository, times(0)).save(tareas);
    }

    @Test
    @Transactional
    public void deleteTareas() throws Exception {
        // Initialize the database
        tareasRepository.saveAndFlush(tareas);

        int databaseSizeBeforeDelete = tareasRepository.findAll().size();

        // Delete the tareas
        restTareasMockMvc.perform(delete("/api/tareas/{id}", tareas.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tareas> tareasList = tareasRepository.findAll();
        assertThat(tareasList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Tareas in Elasticsearch
        verify(mockTareasSearchRepository, times(1)).deleteById(tareas.getId());
    }

    @Test
    @Transactional
    public void searchTareas() throws Exception {
        // Initialize the database
        tareasRepository.saveAndFlush(tareas);
        when(mockTareasSearchRepository.search(queryStringQuery("id:" + tareas.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(tareas), PageRequest.of(0, 1), 1));
        // Search the tareas
        restTareasMockMvc.perform(get("/api/_search/tareas?query=id:" + tareas.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tareas.getId().intValue())))
            .andExpect(jsonPath("$.[*].responsable").value(hasItem(DEFAULT_RESPONSABLE)))
            .andExpect(jsonPath("$.[*].titulo").value(hasItem(DEFAULT_TITULO)))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO.toString())))
            .andExpect(jsonPath("$.[*].fechafin").value(hasItem(DEFAULT_FECHAFIN.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Tareas.class);
        Tareas tareas1 = new Tareas();
        tareas1.setId(1L);
        Tareas tareas2 = new Tareas();
        tareas2.setId(tareas1.getId());
        assertThat(tareas1).isEqualTo(tareas2);
        tareas2.setId(2L);
        assertThat(tareas1).isNotEqualTo(tareas2);
        tareas1.setId(null);
        assertThat(tareas1).isNotEqualTo(tareas2);
    }
}

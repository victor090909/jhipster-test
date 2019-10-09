package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.JhipsterTestApp;
import com.mycompany.myapp.domain.Peticion;
import com.mycompany.myapp.repository.PeticionRepository;
import com.mycompany.myapp.repository.search.PeticionSearchRepository;
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
import java.util.Collections;
import java.util.List;

import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.domain.enumeration.Tipo;
import com.mycompany.myapp.domain.enumeration.Estado;
/**
 * Integration tests for the {@link PeticionResource} REST controller.
 */
@SpringBootTest(classes = JhipsterTestApp.class)
public class PeticionResourceIT {

    private static final String DEFAULT_CODIGO = "AAAAAAAAAA";
    private static final String UPDATED_CODIGO = "BBBBBBBBBB";

    private static final Tipo DEFAULT_TIPO = Tipo.PROYECTO;
    private static final Tipo UPDATED_TIPO = Tipo.EVOLUTIVO;

    private static final String DEFAULT_ASUNTO = "AAAAAAAAAA";
    private static final String UPDATED_ASUNTO = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final Estado DEFAULT_ESTADO = Estado.NUEVA;
    private static final Estado UPDATED_ESTADO = Estado.ENCURSO;

    private static final String DEFAULT_PROPIETARIO = "AAAAAAAAAA";
    private static final String UPDATED_PROPIETARIO = "BBBBBBBBBB";

    @Autowired
    private PeticionRepository peticionRepository;

    /**
     * This repository is mocked in the com.mycompany.myapp.repository.search test package.
     *
     * @see com.mycompany.myapp.repository.search.PeticionSearchRepositoryMockConfiguration
     */
    @Autowired
    private PeticionSearchRepository mockPeticionSearchRepository;

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

    private MockMvc restPeticionMockMvc;

    private Peticion peticion;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PeticionResource peticionResource = new PeticionResource(peticionRepository, mockPeticionSearchRepository);
        this.restPeticionMockMvc = MockMvcBuilders.standaloneSetup(peticionResource)
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
    public static Peticion createEntity(EntityManager em) {
        Peticion peticion = new Peticion()
            .codigo(DEFAULT_CODIGO)
            .tipo(DEFAULT_TIPO)
            .asunto(DEFAULT_ASUNTO)
            .descripcion(DEFAULT_DESCRIPCION)
            .estado(DEFAULT_ESTADO)
            .propietario(DEFAULT_PROPIETARIO);
        return peticion;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Peticion createUpdatedEntity(EntityManager em) {
        Peticion peticion = new Peticion()
            .codigo(UPDATED_CODIGO)
            .tipo(UPDATED_TIPO)
            .asunto(UPDATED_ASUNTO)
            .descripcion(UPDATED_DESCRIPCION)
            .estado(UPDATED_ESTADO)
            .propietario(UPDATED_PROPIETARIO);
        return peticion;
    }

    @BeforeEach
    public void initTest() {
        peticion = createEntity(em);
    }

    @Test
    @Transactional
    public void createPeticion() throws Exception {
        int databaseSizeBeforeCreate = peticionRepository.findAll().size();

        // Create the Peticion
        restPeticionMockMvc.perform(post("/api/peticions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(peticion)))
            .andExpect(status().isCreated());

        // Validate the Peticion in the database
        List<Peticion> peticionList = peticionRepository.findAll();
        assertThat(peticionList).hasSize(databaseSizeBeforeCreate + 1);
        Peticion testPeticion = peticionList.get(peticionList.size() - 1);
        assertThat(testPeticion.getCodigo()).isEqualTo(DEFAULT_CODIGO);
        assertThat(testPeticion.getTipo()).isEqualTo(DEFAULT_TIPO);
        assertThat(testPeticion.getAsunto()).isEqualTo(DEFAULT_ASUNTO);
        assertThat(testPeticion.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
        assertThat(testPeticion.getEstado()).isEqualTo(DEFAULT_ESTADO);
        assertThat(testPeticion.getPropietario()).isEqualTo(DEFAULT_PROPIETARIO);

        // Validate the Peticion in Elasticsearch
        verify(mockPeticionSearchRepository, times(1)).save(testPeticion);
    }

    @Test
    @Transactional
    public void createPeticionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = peticionRepository.findAll().size();

        // Create the Peticion with an existing ID
        peticion.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPeticionMockMvc.perform(post("/api/peticions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(peticion)))
            .andExpect(status().isBadRequest());

        // Validate the Peticion in the database
        List<Peticion> peticionList = peticionRepository.findAll();
        assertThat(peticionList).hasSize(databaseSizeBeforeCreate);

        // Validate the Peticion in Elasticsearch
        verify(mockPeticionSearchRepository, times(0)).save(peticion);
    }


    @Test
    @Transactional
    public void getAllPeticions() throws Exception {
        // Initialize the database
        peticionRepository.saveAndFlush(peticion);

        // Get all the peticionList
        restPeticionMockMvc.perform(get("/api/peticions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(peticion.getId().intValue())))
            .andExpect(jsonPath("$.[*].codigo").value(hasItem(DEFAULT_CODIGO.toString())))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO.toString())))
            .andExpect(jsonPath("$.[*].asunto").value(hasItem(DEFAULT_ASUNTO.toString())))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION.toString())))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO.toString())))
            .andExpect(jsonPath("$.[*].propietario").value(hasItem(DEFAULT_PROPIETARIO.toString())));
    }
    
    @Test
    @Transactional
    public void getPeticion() throws Exception {
        // Initialize the database
        peticionRepository.saveAndFlush(peticion);

        // Get the peticion
        restPeticionMockMvc.perform(get("/api/peticions/{id}", peticion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(peticion.getId().intValue()))
            .andExpect(jsonPath("$.codigo").value(DEFAULT_CODIGO.toString()))
            .andExpect(jsonPath("$.tipo").value(DEFAULT_TIPO.toString()))
            .andExpect(jsonPath("$.asunto").value(DEFAULT_ASUNTO.toString()))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION.toString()))
            .andExpect(jsonPath("$.estado").value(DEFAULT_ESTADO.toString()))
            .andExpect(jsonPath("$.propietario").value(DEFAULT_PROPIETARIO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPeticion() throws Exception {
        // Get the peticion
        restPeticionMockMvc.perform(get("/api/peticions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePeticion() throws Exception {
        // Initialize the database
        peticionRepository.saveAndFlush(peticion);

        int databaseSizeBeforeUpdate = peticionRepository.findAll().size();

        // Update the peticion
        Peticion updatedPeticion = peticionRepository.findById(peticion.getId()).get();
        // Disconnect from session so that the updates on updatedPeticion are not directly saved in db
        em.detach(updatedPeticion);
        updatedPeticion
            .codigo(UPDATED_CODIGO)
            .tipo(UPDATED_TIPO)
            .asunto(UPDATED_ASUNTO)
            .descripcion(UPDATED_DESCRIPCION)
            .estado(UPDATED_ESTADO)
            .propietario(UPDATED_PROPIETARIO);

        restPeticionMockMvc.perform(put("/api/peticions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPeticion)))
            .andExpect(status().isOk());

        // Validate the Peticion in the database
        List<Peticion> peticionList = peticionRepository.findAll();
        assertThat(peticionList).hasSize(databaseSizeBeforeUpdate);
        Peticion testPeticion = peticionList.get(peticionList.size() - 1);
        assertThat(testPeticion.getCodigo()).isEqualTo(UPDATED_CODIGO);
        assertThat(testPeticion.getTipo()).isEqualTo(UPDATED_TIPO);
        assertThat(testPeticion.getAsunto()).isEqualTo(UPDATED_ASUNTO);
        assertThat(testPeticion.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testPeticion.getEstado()).isEqualTo(UPDATED_ESTADO);
        assertThat(testPeticion.getPropietario()).isEqualTo(UPDATED_PROPIETARIO);

        // Validate the Peticion in Elasticsearch
        verify(mockPeticionSearchRepository, times(1)).save(testPeticion);
    }

    @Test
    @Transactional
    public void updateNonExistingPeticion() throws Exception {
        int databaseSizeBeforeUpdate = peticionRepository.findAll().size();

        // Create the Peticion

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPeticionMockMvc.perform(put("/api/peticions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(peticion)))
            .andExpect(status().isBadRequest());

        // Validate the Peticion in the database
        List<Peticion> peticionList = peticionRepository.findAll();
        assertThat(peticionList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Peticion in Elasticsearch
        verify(mockPeticionSearchRepository, times(0)).save(peticion);
    }

    @Test
    @Transactional
    public void deletePeticion() throws Exception {
        // Initialize the database
        peticionRepository.saveAndFlush(peticion);

        int databaseSizeBeforeDelete = peticionRepository.findAll().size();

        // Delete the peticion
        restPeticionMockMvc.perform(delete("/api/peticions/{id}", peticion.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Peticion> peticionList = peticionRepository.findAll();
        assertThat(peticionList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Peticion in Elasticsearch
        verify(mockPeticionSearchRepository, times(1)).deleteById(peticion.getId());
    }

    @Test
    @Transactional
    public void searchPeticion() throws Exception {
        // Initialize the database
        peticionRepository.saveAndFlush(peticion);
        when(mockPeticionSearchRepository.search(queryStringQuery("id:" + peticion.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(peticion), PageRequest.of(0, 1), 1));
        // Search the peticion
        restPeticionMockMvc.perform(get("/api/_search/peticions?query=id:" + peticion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(peticion.getId().intValue())))
            .andExpect(jsonPath("$.[*].codigo").value(hasItem(DEFAULT_CODIGO)))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO.toString())))
            .andExpect(jsonPath("$.[*].asunto").value(hasItem(DEFAULT_ASUNTO)))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO.toString())))
            .andExpect(jsonPath("$.[*].propietario").value(hasItem(DEFAULT_PROPIETARIO)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Peticion.class);
        Peticion peticion1 = new Peticion();
        peticion1.setId(1L);
        Peticion peticion2 = new Peticion();
        peticion2.setId(peticion1.getId());
        assertThat(peticion1).isEqualTo(peticion2);
        peticion2.setId(2L);
        assertThat(peticion1).isNotEqualTo(peticion2);
        peticion1.setId(null);
        assertThat(peticion1).isNotEqualTo(peticion2);
    }
}

package com.mycompany.myapp.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;

import com.mycompany.myapp.domain.enumeration.Estado;

/**
 * A Costes.
 */
@Entity
@Table(name = "costes")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "costes")
public class Costes implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @Column(name = "proveedor")
    private String proveedor;

    @Column(name = "servicio")
    private String servicio;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private Estado estado;

    @Column(name = "coste")
    private Long coste;

    @ManyToOne
    @JsonIgnoreProperties("costes")
    private Peticion peticion;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProveedor() {
        return proveedor;
    }

    public Costes proveedor(String proveedor) {
        this.proveedor = proveedor;
        return this;
    }

    public void setProveedor(String proveedor) {
        this.proveedor = proveedor;
    }

    public String getServicio() {
        return servicio;
    }

    public Costes servicio(String servicio) {
        this.servicio = servicio;
        return this;
    }

    public void setServicio(String servicio) {
        this.servicio = servicio;
    }

    public Estado getEstado() {
        return estado;
    }

    public Costes estado(Estado estado) {
        this.estado = estado;
        return this;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public Long getCoste() {
        return coste;
    }

    public Costes coste(Long coste) {
        this.coste = coste;
        return this;
    }

    public void setCoste(Long coste) {
        this.coste = coste;
    }

    public Peticion getPeticion() {
        return peticion;
    }

    public Costes peticion(Peticion peticion) {
        this.peticion = peticion;
        return this;
    }

    public void setPeticion(Peticion peticion) {
        this.peticion = peticion;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Costes)) {
            return false;
        }
        return id != null && id.equals(((Costes) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Costes{" +
            "id=" + getId() +
            ", proveedor='" + getProveedor() + "'" +
            ", servicio='" + getServicio() + "'" +
            ", estado='" + getEstado() + "'" +
            ", coste=" + getCoste() +
            "}";
    }
}

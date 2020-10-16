package com.mycompany.myapp.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.mycompany.myapp.web.rest.TestUtil;

public class PeticionTest {

    @Test
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

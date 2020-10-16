package com.mycompany.myapp.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.mycompany.myapp.web.rest.TestUtil;

public class TareasTest {

    @Test
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

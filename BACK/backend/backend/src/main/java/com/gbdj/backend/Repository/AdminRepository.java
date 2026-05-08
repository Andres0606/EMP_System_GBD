package com.gbdj.backend.Repository;

import com.gbdj.backend.Entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
}

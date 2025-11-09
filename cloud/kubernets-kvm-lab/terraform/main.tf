terraform {
  required_providers {
    libvirt = {
      source  = "dmacvicar/libvirt"
      version = "~>0.9"
    }
  }
}

provider "libvirt" {
  uri = "qemu:///system"
}


resource "libvirt_volume" "ubuntu_base" { # create the imutable image
  name   = "ubuntu-base.qcow2"            # name creates
  pool   = var.storage_pool               # wich pool it will be storage 
  format = "qcow2"                        # the format saved
  create = {
    content = { # from where ? can be local too
      url = var.base_image_url
    }
  }

  lifecycle {
    prevent_destroy = true
  }

}

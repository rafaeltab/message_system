use std::{env, error::Error, path::PathBuf};

fn main() -> Result<(), Box<dyn Error>> {
    let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());

    tonic_build::configure()
        .file_descriptor_set_path(out_dir.join("notification_descriptor.bin"))
        .compile(&["proto/notification.proto"], &["proto"])?;

    tonic_build::compile_protos("proto/notification.proto")?;

    Ok(())
}

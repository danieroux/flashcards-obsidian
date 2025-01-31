{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils } @ inputs:

    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; config.allowUnfree = true; };
        fo-dev = pkgs.writeShellScriptBin "fo-dev" "npm install && npm run bootstrap && npm run dev";
        fo-test = pkgs.writeShellScriptBin "fo-test" "npm install && npm run test";
        fo-reset-test-environment = pkgs.writeShellScriptBin "fo-reset-test-environment" "cd $(git rev-parse --show-toplevel) && git checkout -- docs/test-vault/ tests/anki_base && git clean -fd tests/anki_base/flashcards-obsidian";
        fo-build = pkgs.writeShellScriptBin "fo-build" "npm install && npm run build";
        fo-anki-for-testing = pkgs.writeShellScriptBin "fo-anki-for-testing" "${pkgs.anki-bin.outPath}/Applications/Anki.app/Contents/MacOS/anki --base $(git rev-parse --show-toplevel)/tests/anki_base";
      fo-refresh-hot-reload = pkgs.writeShellScriptBin "fo-refresh-hot-reload" ''
        set -e
        cd docs/test-vault/.obsidian/plugins
        rm -rf hot-reload*
        curl -OL https://github.com/pjeby/hot-reload/archive/refs/heads/master.zip
        unzip master.zip
        '';
      in
      rec {
        formatter = pkgs.nixpkgs-fmt;

        devShells.default = pkgs.mkShellNoCC {
          shellHook = ''
                    echo "Open the vault in docs/test-vault"
                    echo
                    echo "Run the scripts that are available in this environment:"
                    echo
                    echo fo-dev # This will build to docs/test-vault
                    echo fo-test
                    echo fo-build
                    echo
                    echo "Also:"
                    echo
                    echo fo-anki-for-testing
                    echo fo-reset-test-environment
                    echo fo-refresh-hot-reload
                    echo
                    echo "fo-<tab> for more"
          '';

          packages = [ 
            pkgs.nodejs 
            pkgs.anki-bin 
            pkgs.curl
            fo-dev
            fo-test
            fo-build 
            fo-reset-test-environment
            fo-anki-for-testing
            fo-refresh-hot-reload
          ];
        };
      });
}
